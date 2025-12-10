import { WhatsAppFlow, IWhatsAppFlow, FlowSyncCheckpoint } from './flows.model';
import * as integrationService from '../integrations/integration.service';
import * as credentialsService from '../credentials/credentials.service';

interface MetaFlowResponse {
  id: string;
  name: string;
  status: string;
  categories?: string[];
  validation_errors?: { error: string }[];
  json_version?: string;
  data_api_version?: string;
  data_channel_uri?: string;
  preview?: { preview_url: string };
  updated_at?: string;
}

interface MetaFlowsListResponse {
  data: MetaFlowResponse[];
  paging?: {
    cursors?: {
      after?: string;
      before?: string;
    };
    next?: string;
  };
}

export async function syncFlowsFromMeta(userId: string): Promise<{
  synced: number;
  created: number;
  updated: number;
  errors: string[];
}> {
  const results = {
    synced: 0,
    created: 0,
    updated: 0,
    errors: [] as string[]
  };

  try {
    let accessToken: string | undefined;
    let wabaId: string | undefined;

    const integrationCreds = await integrationService.getDecryptedCredentials(userId, 'whatsapp');
    if (integrationCreds?.accessToken && integrationCreds?.businessAccountId) {
      accessToken = integrationCreds.accessToken;
      wabaId = integrationCreds.businessAccountId;
    } else {
      const storedCreds = await credentialsService.getDecryptedCredentials(userId);
      if (storedCreds?.whatsappToken && storedCreds?.businessAccountId) {
        accessToken = storedCreds.whatsappToken;
        wabaId = storedCreds.businessAccountId;
      }
    }

    if (!accessToken) {
      accessToken = process.env.WHATSAPP_TOKEN_NEW || process.env.WHATSAPP_TOKEN;
      wabaId = wabaId || process.env.BUSINESS_ACCOUNT_ID;
    }

    if (!wabaId || !accessToken) {
      throw new Error('WhatsApp credentials incomplete - missing Business Account ID or access token');
    }

    await FlowSyncCheckpoint.findOneAndUpdate(
      { userId },
      { $set: { syncStatus: 'syncing', wabaId } },
      { upsert: true }
    );

    let hasMore = true;
    let afterCursor: string | undefined;

    while (hasMore) {
      const url = new URL(`https://graph.facebook.com/v18.0/${wabaId}/flows`);
      url.searchParams.append('fields', 'id,name,status,categories,validation_errors,json_version,data_api_version,data_channel_uri,preview,updated_at');
      if (afterCursor) {
        url.searchParams.append('after', afterCursor);
      }

      const response = await fetch(url.toString(), {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to fetch flows from Meta');
      }

      const data: MetaFlowsListResponse = await response.json();

      for (const flow of data.data) {
        try {
          const existingFlow = await WhatsAppFlow.findOne({ userId, flowId: flow.id });
          
          const flowData = {
            userId,
            flowId: flow.id,
            name: flow.name,
            status: flow.status as any,
            categories: flow.categories || [],
            validationErrors: flow.validation_errors?.map(e => e.error) || [],
            jsonVersion: flow.json_version,
            dataApiVersion: flow.data_api_version,
            dataChannelUri: flow.data_channel_uri,
            previewUrl: flow.preview?.preview_url,
            metaUpdatedAt: flow.updated_at ? new Date(flow.updated_at) : undefined,
            lastSyncedAt: new Date()
          };

          if (existingFlow) {
            await WhatsAppFlow.updateOne(
              { _id: existingFlow._id },
              { $set: flowData }
            );
            results.updated++;
          } else {
            await WhatsAppFlow.create({
              ...flowData,
              entryPoints: [{
                id: 'default',
                name: 'Default Entry',
                type: 'CTA'
              }]
            });
            results.created++;
          }
          results.synced++;
        } catch (flowError: any) {
          results.errors.push(`Flow ${flow.id}: ${flowError.message}`);
        }
      }

      if (data.paging?.next && data.paging?.cursors?.after) {
        afterCursor = data.paging.cursors.after;
      } else {
        hasMore = false;
      }
    }

    await FlowSyncCheckpoint.findOneAndUpdate(
      { userId },
      { 
        $set: { 
          syncStatus: 'idle', 
          lastSyncedAt: new Date(),
          nextCursor: undefined,
          lastError: undefined
        } 
      }
    );

    console.log(`[Flows] Synced ${results.synced} flows for user ${userId} (${results.created} new, ${results.updated} updated)`);
    return results;
  } catch (error: any) {
    await FlowSyncCheckpoint.findOneAndUpdate(
      { userId },
      { $set: { syncStatus: 'error', lastError: error.message } }
    );
    console.error('[Flows] Sync error:', error);
    throw error;
  }
}

export async function getFlows(userId: string, filters?: {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<{ flows: IWhatsAppFlow[]; total: number }> {
  const query: any = { userId };
  
  if (filters?.status) query.status = filters.status;
  if (filters?.search) {
    query.name = { $regex: filters.search, $options: 'i' };
  }

  const page = filters?.page || 1;
  const limit = filters?.limit || 50;
  const skip = (page - 1) * limit;

  const [flows, total] = await Promise.all([
    WhatsAppFlow.find(query).sort({ updatedAt: -1 }).skip(skip).limit(limit),
    WhatsAppFlow.countDocuments(query)
  ]);

  return { flows, total };
}

export async function getFlowById(userId: string, id: string): Promise<IWhatsAppFlow | null> {
  return WhatsAppFlow.findOne({ _id: id, userId });
}

export async function getFlowByFlowId(userId: string, flowId: string): Promise<IWhatsAppFlow | null> {
  return WhatsAppFlow.findOne({ flowId, userId });
}

export async function updateFlowEntryPoints(
  userId: string, 
  id: string, 
  entryPoints: { id: string; name: string; type: 'CTA' | 'BUTTON' | 'LIST' }[]
): Promise<IWhatsAppFlow | null> {
  return WhatsAppFlow.findOneAndUpdate(
    { _id: id, userId },
    { $set: { entryPoints } },
    { new: true }
  );
}

export async function attachFlowToTemplate(
  userId: string, 
  flowId: string, 
  templateId: string
): Promise<IWhatsAppFlow | null> {
  return WhatsAppFlow.findOneAndUpdate(
    { _id: flowId, userId },
    { $addToSet: { linkedTemplateIds: templateId } },
    { new: true }
  );
}

export async function detachFlowFromTemplate(
  userId: string, 
  flowId: string, 
  templateId: string
): Promise<IWhatsAppFlow | null> {
  return WhatsAppFlow.findOneAndUpdate(
    { _id: flowId, userId },
    { $pull: { linkedTemplateIds: templateId } },
    { new: true }
  );
}

export async function attachFlowToAgent(
  userId: string, 
  flowId: string, 
  agentId: string
): Promise<IWhatsAppFlow | null> {
  return WhatsAppFlow.findOneAndUpdate(
    { _id: flowId, userId },
    { $addToSet: { linkedAgentIds: agentId } },
    { new: true }
  );
}

export async function detachFlowFromAgent(
  userId: string, 
  flowId: string, 
  agentId: string
): Promise<IWhatsAppFlow | null> {
  return WhatsAppFlow.findOneAndUpdate(
    { _id: flowId, userId },
    { $pull: { linkedAgentIds: agentId } },
    { new: true }
  );
}

export async function deleteFlow(userId: string, id: string): Promise<boolean> {
  const result = await WhatsAppFlow.deleteOne({ _id: id, userId });
  return result.deletedCount > 0;
}

export async function getSyncStatus(userId: string): Promise<{
  lastSyncedAt?: Date;
  syncStatus: string;
  lastError?: string;
  totalFlows: number;
}> {
  const [checkpoint, totalFlows] = await Promise.all([
    FlowSyncCheckpoint.findOne({ userId }),
    WhatsAppFlow.countDocuments({ userId })
  ]);

  return {
    lastSyncedAt: checkpoint?.lastSyncedAt,
    syncStatus: checkpoint?.syncStatus || 'idle',
    lastError: checkpoint?.lastError,
    totalFlows
  };
}

export async function getFlowStats(userId: string): Promise<{
  totalFlows: number;
  publishedFlows: number;
  draftFlows: number;
  linkedToTemplates: number;
  linkedToAgents: number;
}> {
  const [total, published, draft, linkedTemplates, linkedAgents] = await Promise.all([
    WhatsAppFlow.countDocuments({ userId }),
    WhatsAppFlow.countDocuments({ userId, status: 'PUBLISHED' }),
    WhatsAppFlow.countDocuments({ userId, status: 'DRAFT' }),
    WhatsAppFlow.countDocuments({ userId, linkedTemplateIds: { $exists: true, $ne: [] } }),
    WhatsAppFlow.countDocuments({ userId, linkedAgentIds: { $exists: true, $ne: [] } })
  ]);

  return {
    totalFlows: total,
    publishedFlows: published,
    draftFlows: draft,
    linkedToTemplates: linkedTemplates,
    linkedToAgents: linkedAgents
  };
}
