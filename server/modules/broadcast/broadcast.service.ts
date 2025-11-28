import * as mongodb from '../storage/mongodb.adapter';
import * as templateService from '../leadAutoReply/templateMessages.service';
import * as openaiService from '../openai/openai.service';
import * as agentService from '../aiAgents/agent.service';

export interface BroadcastList {
  id: string;
  name: string;
  contacts: BroadcastContact[];
  createdAt: string;
  updatedAt: string;
}

export interface BroadcastContact {
  name: string;
  phone: string;
  email?: string;
  tags?: string[];
}

export interface ScheduledMessage {
  id: string;
  name: string;
  messageType: 'template' | 'custom' | 'ai_agent';
  templateName?: string;
  customMessage?: string;
  agentId?: string;
  contactIds?: string[];
  listId?: string;
  scheduledAt: string;
  status: 'scheduled' | 'sent' | 'failed' | 'cancelled';
  recipientCount: number;
  sentCount: number;
  failedCount: number;
  createdAt: string;
}

export interface SendMessageResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

function getWhatsAppCredentials(): { token: string; phoneNumberId: string } | null {
  const token = process.env.WHATSAPP_TOKEN_NEW || process.env.WHATSAPP_TOKEN;
  const phoneNumberId = process.env.PHONE_NUMBER_ID;
  
  if (!token || !phoneNumberId) {
    return null;
  }
  
  return { token, phoneNumberId };
}

function formatPhoneNumber(phone: string): string {
  let cleaned = phone.replace(/\D/g, '');
  
  if (phone.trim().startsWith('+')) {
    return cleaned;
  }
  
  if (cleaned.startsWith('00')) {
    cleaned = cleaned.substring(2);
    return cleaned;
  }
  
  const commonCountryCodes = ['1', '44', '91', '92', '93', '94', '971', '966', '965', '974', '20', '27', '61', '64', '81', '86', '62'];
  for (const code of commonCountryCodes) {
    if (cleaned.startsWith(code) && cleaned.length >= 10) {
      return cleaned;
    }
  }
  
  if (cleaned.startsWith('0')) {
    cleaned = '91' + cleaned.substring(1);
  }

  return cleaned;
}

export async function getBroadcastLists(): Promise<BroadcastList[]> {
  return mongodb.readCollection<BroadcastList>('broadcast_lists');
}

export async function getBroadcastListById(id: string): Promise<BroadcastList | undefined> {
  const result = await mongodb.findOne<BroadcastList>('broadcast_lists', { id });
  return result || undefined;
}

export async function createBroadcastList(name: string, contacts: BroadcastContact[]): Promise<BroadcastList> {
  const newList: BroadcastList = {
    id: `list-${Date.now()}`,
    name,
    contacts,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await mongodb.insertOne('broadcast_lists', newList);
  return newList;
}

export async function updateBroadcastList(id: string, name: string, contacts: BroadcastContact[]): Promise<BroadcastList | null> {
  const existing = await getBroadcastListById(id);
  if (!existing) return null;
  
  const updated: BroadcastList = {
    ...existing,
    name,
    contacts,
    updatedAt: new Date().toISOString(),
  };
  await mongodb.updateOne('broadcast_lists', { id }, updated);
  return updated;
}

export async function deleteBroadcastList(id: string): Promise<boolean> {
  return mongodb.deleteOne('broadcast_lists', { id });
}

export async function getScheduledMessages(): Promise<ScheduledMessage[]> {
  return mongodb.readCollection<ScheduledMessage>('scheduled_messages');
}

export async function createScheduledMessage(data: Omit<ScheduledMessage, 'id' | 'createdAt' | 'sentCount' | 'failedCount'>): Promise<ScheduledMessage> {
  const newMessage: ScheduledMessage = {
    ...data,
    id: `schedule-${Date.now()}`,
    createdAt: new Date().toISOString(),
    sentCount: 0,
    failedCount: 0,
  };
  await mongodb.insertOne('scheduled_messages', newMessage);
  return newMessage;
}

export async function updateScheduledMessage(id: string, updates: Partial<ScheduledMessage>): Promise<ScheduledMessage | null> {
  const existing = await mongodb.findOne<ScheduledMessage>('scheduled_messages', { id });
  if (!existing) return null;
  
  const updated = { ...existing, ...updates };
  await mongodb.updateOne('scheduled_messages', { id }, updated);
  return updated;
}

export async function deleteScheduledMessage(id: string): Promise<boolean> {
  return mongodb.deleteOne('scheduled_messages', { id });
}

export async function sendTemplateMessage(phone: string, templateName: string, contactName?: string): Promise<SendMessageResult> {
  const components: templateService.TemplateComponent[] = [];
  
  if (templateName.includes('awards') || templateName.includes('marketing')) {
    components.push({
      type: 'body',
      parameters: [
        {
          type: 'text',
          text: contactName || 'Valued Customer',
          parameter_name: 'name',
        }
      ]
    });
  }
  
  const result = await templateService.sendTemplateMessage(formatPhoneNumber(phone), {
    name: templateName,
    languageCode: 'en',
    components: components.length > 0 ? components : undefined,
  });
  return result;
}

export async function sendCustomMessage(phone: string, message: string): Promise<SendMessageResult> {
  const credentials = getWhatsAppCredentials();
  
  if (!credentials) {
    console.error('[CustomMessage] WhatsApp credentials not configured');
    return { success: false, error: 'WhatsApp credentials not configured' };
  }

  const formattedPhone = formatPhoneNumber(phone);
  console.log(`[CustomMessage] Sending to ${formattedPhone}: "${message.substring(0, 50)}..."`);

  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${credentials.phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${credentials.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: formattedPhone,
          type: 'text',
          text: { body: message }
        }),
      }
    );

    const data = await response.json();
    
    if (response.ok && data.messages?.[0]?.id) {
      console.log(`[CustomMessage] Successfully sent to ${formattedPhone}`);
      return { success: true, messageId: data.messages[0].id };
    } else {
      const errorMsg = data.error?.message || 'Failed to send message';
      const errorCode = data.error?.code;
      console.error(`[CustomMessage] Failed (code: ${errorCode}): ${errorMsg}`);
      
      if (errorCode === 131047 || errorMsg.includes('24 hour') || errorMsg.includes('Re-engagement')) {
        return { 
          success: false, 
          error: 'Cannot send custom message - outside 24-hour window. Customer must message you first, or use a template message.' 
        };
      }
      
      return { success: false, error: errorMsg };
    }
  } catch (error) {
    console.error('[CustomMessage] Error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function sendAIAgentMessage(phone: string, agentId: string, context?: string): Promise<SendMessageResult> {
  const agent = await agentService.getAgentById(agentId);
  if (!agent) {
    console.error(`[AIAgent] Agent not found: ${agentId}`);
    return { success: false, error: 'Agent not found' };
  }

  console.log(`[AIAgent] Generating message with agent "${agent.name}" for ${phone}`);
  
  const prompt = context || 'Generate a friendly welcome message for a new contact. Keep it under 160 characters.';
  const aiMessage = await openaiService.generateAgentResponse(prompt, agent);
  
  if (!aiMessage) {
    console.error('[AIAgent] Failed to generate AI message');
    return { success: false, error: 'Failed to generate AI message. Check if OPENAI_API_KEY is configured.' };
  }

  console.log(`[AIAgent] AI generated: "${aiMessage.substring(0, 100)}..."`);

  const customResult = await sendCustomMessage(phone, aiMessage);
  
  if (!customResult.success && (customResult.error?.includes('24') || customResult.error?.includes('window'))) {
    console.log('[AIAgent] Custom message failed (outside 24-hour window), falling back to hello_world template');
    return await templateService.sendHelloWorldTemplate(formatPhoneNumber(phone));
  }
  
  return customResult;
}

export interface BroadcastLog {
  id: string;
  campaignName: string;
  contactName: string;
  contactPhone: string;
  messageType: 'template' | 'custom' | 'ai_agent';
  templateName?: string;
  message?: string;
  status: 'sent' | 'delivered' | 'failed' | 'pending';
  messageId?: string;
  error?: string;
  timestamp: string;
}

export async function logBroadcastMessage(log: Omit<BroadcastLog, 'id'>): Promise<BroadcastLog> {
  const newLog: BroadcastLog = {
    ...log,
    id: `broadcast-log-${Date.now()}-${Math.random().toString(36).substring(7)}`,
  };
  await mongodb.insertOne('broadcast_logs', newLog);
  return newLog;
}

export async function getBroadcastLogs(filters?: { 
  campaignName?: string; 
  status?: string; 
  phone?: string;
  limit?: number;
  offset?: number;
}): Promise<BroadcastLog[]> {
  let logs = await mongodb.readCollection<BroadcastLog>('broadcast_logs');
  
  if (filters) {
    if (filters.campaignName) {
      logs = logs.filter(l => l.campaignName.toLowerCase().includes(filters.campaignName!.toLowerCase()));
    }
    if (filters.status) {
      logs = logs.filter(l => l.status === filters.status);
    }
    if (filters.phone) {
      logs = logs.filter(l => l.contactPhone.includes(filters.phone!));
    }
  }
  
  logs = logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
  const offset = filters?.offset || 0;
  const limit = filters?.limit || 100;
  return logs.slice(offset, offset + limit);
}

export async function sendBroadcast(
  contacts: BroadcastContact[],
  messageType: 'template' | 'custom' | 'ai_agent',
  options: {
    templateName?: string;
    customMessage?: string;
    agentId?: string;
    campaignName?: string;
  }
): Promise<{ total: number; successful: number; failed: number; results: Array<{ phone: string; success: boolean; error?: string }> }> {
  const results: Array<{ phone: string; success: boolean; error?: string }> = [];
  let successful = 0;
  let failed = 0;
  const campaignName = options.campaignName || `Broadcast ${new Date().toISOString()}`;

  console.log(`[Broadcast] Starting broadcast to ${contacts.length} contacts`);
  console.log(`[Broadcast] Campaign: ${campaignName}, Type: ${messageType}`);

  for (const contact of contacts) {
    let result: SendMessageResult;
    let messageContent = '';

    switch (messageType) {
      case 'template':
        result = await sendTemplateMessage(contact.phone, options.templateName || 'hello_world', contact.name);
        messageContent = `[Template: ${options.templateName || 'hello_world'}]`;
        break;
      case 'custom':
        result = await sendCustomMessage(contact.phone, options.customMessage || '');
        messageContent = options.customMessage || '';
        break;
      case 'ai_agent':
        result = await sendAIAgentMessage(contact.phone, options.agentId || '', `Contact name: ${contact.name}`);
        messageContent = '[AI Generated Message]';
        break;
      default:
        result = { success: false, error: 'Invalid message type' };
        messageContent = '';
    }

    await logBroadcastMessage({
      campaignName,
      contactName: contact.name,
      contactPhone: contact.phone,
      messageType,
      templateName: options.templateName,
      message: messageContent,
      status: result.success ? 'sent' : 'failed',
      messageId: result.messageId,
      error: result.error,
      timestamp: new Date().toISOString(),
    });

    results.push({
      phone: contact.phone,
      success: result.success,
      error: result.error,
    });

    if (result.success) {
      successful++;
      console.log(`[Broadcast] Sent to ${contact.phone} (${contact.name})`);
    } else {
      failed++;
      console.log(`[Broadcast] Failed for ${contact.phone}: ${result.error}`);
    }

    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log(`[Broadcast] Complete: ${successful} successful, ${failed} failed`);

  return {
    total: contacts.length,
    successful,
    failed,
    results,
  };
}

export async function sendSingleMessage(
  phone: string,
  name: string,
  messageType: 'template' | 'custom' | 'ai_agent',
  options: {
    templateName?: string;
    customMessage?: string;
    agentId?: string;
  }
): Promise<SendMessageResult> {
  switch (messageType) {
    case 'template':
      return await sendTemplateMessage(phone, options.templateName || 'hello_world', name);
    case 'custom':
      return await sendCustomMessage(phone, options.customMessage || '');
    case 'ai_agent':
      return await sendAIAgentMessage(phone, options.agentId || '', `Contact name: ${name}`);
    default:
      return { success: false, error: 'Invalid message type' };
  }
}

export function parseExcelContacts(data: unknown[]): BroadcastContact[] {
  const contacts: BroadcastContact[] = [];
  
  for (const row of data) {
    if (typeof row !== 'object' || row === null) continue;
    
    const record = row as Record<string, unknown>;
    const name = String(record['name'] || record['Name'] || record['FULL_NAME'] || record['full_name'] || '').trim();
    const phone = String(record['phone'] || record['Phone'] || record['PHONE'] || record['phone_number'] || record['mobile'] || record['Mobile'] || '').trim();
    const email = String(record['email'] || record['Email'] || record['EMAIL'] || '').trim();
    
    if (name && phone) {
      contacts.push({
        name,
        phone,
        email: email || undefined,
      });
    }
  }
  
  return contacts;
}

export function exportContactsToJSON(contacts: BroadcastContact[]): object[] {
  return contacts.map(c => ({
    name: c.name,
    phone: c.phone,
    email: c.email || '',
    tags: c.tags?.join(', ') || '',
  }));
}
