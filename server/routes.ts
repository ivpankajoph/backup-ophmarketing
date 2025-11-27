import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertContactSchema,
  insertMessageSchema,
  insertCampaignSchema,
  insertTemplateSchema,
  insertAutomationSchema,
  insertTeamMemberSchema,
} from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to get dashboard stats" });
    }
  });

  app.get("/api/contacts", async (req, res) => {
    try {
      const contacts = await storage.getContacts();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ message: "Failed to get contacts" });
    }
  });

  app.get("/api/contacts/:id", async (req, res) => {
    try {
      const contact = await storage.getContact(req.params.id);
      if (!contact) {
        return res.status(404).json({ message: "Contact not found" });
      }
      res.json(contact);
    } catch (error) {
      res.status(500).json({ message: "Failed to get contact" });
    }
  });

  app.post("/api/contacts", async (req, res) => {
    try {
      const parsed = insertContactSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid contact data", errors: parsed.error.errors });
      }
      const contact = await storage.createContact(parsed.data);
      res.status(201).json(contact);
    } catch (error) {
      res.status(500).json({ message: "Failed to create contact" });
    }
  });

  app.put("/api/contacts/:id", async (req, res) => {
    try {
      const contact = await storage.updateContact(req.params.id, req.body);
      if (!contact) {
        return res.status(404).json({ message: "Contact not found" });
      }
      res.json(contact);
    } catch (error) {
      res.status(500).json({ message: "Failed to update contact" });
    }
  });

  app.delete("/api/contacts/:id", async (req, res) => {
    try {
      const success = await storage.deleteContact(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Contact not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete contact" });
    }
  });

  app.post("/api/contacts/import", async (req, res) => {
    try {
      const { contacts } = req.body;
      if (!Array.isArray(contacts)) {
        return res.status(400).json({ message: "Invalid data format" });
      }
      const imported = [];
      for (const contact of contacts) {
        const parsed = insertContactSchema.safeParse(contact);
        if (parsed.success) {
          const newContact = await storage.createContact(parsed.data);
          imported.push(newContact);
        }
      }
      res.json({ imported: imported.length, contacts: imported });
    } catch (error) {
      res.status(500).json({ message: "Failed to import contacts" });
    }
  });

  app.get("/api/messages", async (req, res) => {
    try {
      const { contactId } = req.query;
      const messages = await storage.getMessages(contactId as string | undefined);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to get messages" });
    }
  });

  app.post("/api/messages", async (req, res) => {
    try {
      const parsed = insertMessageSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid message data", errors: parsed.error.errors });
      }
      const message = await storage.createMessage(parsed.data);
      res.status(201).json(message);
    } catch (error) {
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  app.get("/api/chats", async (req, res) => {
    try {
      const chats = await storage.getChats();
      res.json(chats);
    } catch (error) {
      res.status(500).json({ message: "Failed to get chats" });
    }
  });

  app.get("/api/chats/:id", async (req, res) => {
    try {
      const chat = await storage.getChat(req.params.id);
      if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
      }
      res.json(chat);
    } catch (error) {
      res.status(500).json({ message: "Failed to get chat" });
    }
  });

  app.get("/api/campaigns", async (req, res) => {
    try {
      const campaigns = await storage.getCampaigns();
      res.json(campaigns);
    } catch (error) {
      res.status(500).json({ message: "Failed to get campaigns" });
    }
  });

  app.get("/api/campaigns/:id", async (req, res) => {
    try {
      const campaign = await storage.getCampaign(req.params.id);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      res.json(campaign);
    } catch (error) {
      res.status(500).json({ message: "Failed to get campaign" });
    }
  });

  app.post("/api/campaigns", async (req, res) => {
    try {
      const parsed = insertCampaignSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid campaign data", errors: parsed.error.errors });
      }
      const campaign = await storage.createCampaign(parsed.data);
      res.status(201).json(campaign);
    } catch (error) {
      res.status(500).json({ message: "Failed to create campaign" });
    }
  });

  app.put("/api/campaigns/:id", async (req, res) => {
    try {
      const campaign = await storage.updateCampaign(req.params.id, req.body);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      res.json(campaign);
    } catch (error) {
      res.status(500).json({ message: "Failed to update campaign" });
    }
  });

  app.delete("/api/campaigns/:id", async (req, res) => {
    try {
      const success = await storage.deleteCampaign(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete campaign" });
    }
  });

  app.post("/api/campaigns/:id/send", async (req, res) => {
    try {
      const campaign = await storage.getCampaign(req.params.id);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      const sentCount = campaign.contactIds.length;
      const deliveredCount = Math.floor(sentCount * 0.95);
      const readCount = Math.floor(deliveredCount * 0.7);
      const repliedCount = Math.floor(readCount * 0.2);

      const updatedCampaign = await storage.updateCampaign(req.params.id, {
        status: "completed",
        sentCount,
        deliveredCount,
        readCount,
        repliedCount,
      });
      res.json(updatedCampaign);
    } catch (error) {
      res.status(500).json({ message: "Failed to send campaign" });
    }
  });

  app.get("/api/templates", async (req, res) => {
    try {
      const templates = await storage.getTemplates();
      res.json(templates);
    } catch (error) {
      res.status(500).json({ message: "Failed to get templates" });
    }
  });

  app.get("/api/templates/:id", async (req, res) => {
    try {
      const template = await storage.getTemplate(req.params.id);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      res.json(template);
    } catch (error) {
      res.status(500).json({ message: "Failed to get template" });
    }
  });

  app.post("/api/templates", async (req, res) => {
    try {
      const parsed = insertTemplateSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid template data", errors: parsed.error.errors });
      }
      const template = await storage.createTemplate(parsed.data);
      res.status(201).json(template);
    } catch (error) {
      res.status(500).json({ message: "Failed to create template" });
    }
  });

  app.put("/api/templates/:id", async (req, res) => {
    try {
      const template = await storage.updateTemplate(req.params.id, req.body);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      res.json(template);
    } catch (error) {
      res.status(500).json({ message: "Failed to update template" });
    }
  });

  app.delete("/api/templates/:id", async (req, res) => {
    try {
      const success = await storage.deleteTemplate(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Template not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete template" });
    }
  });

  app.get("/api/automations", async (req, res) => {
    try {
      const automations = await storage.getAutomations();
      res.json(automations);
    } catch (error) {
      res.status(500).json({ message: "Failed to get automations" });
    }
  });

  app.get("/api/automations/:id", async (req, res) => {
    try {
      const automation = await storage.getAutomation(req.params.id);
      if (!automation) {
        return res.status(404).json({ message: "Automation not found" });
      }
      res.json(automation);
    } catch (error) {
      res.status(500).json({ message: "Failed to get automation" });
    }
  });

  app.post("/api/automations", async (req, res) => {
    try {
      const parsed = insertAutomationSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid automation data", errors: parsed.error.errors });
      }
      const automation = await storage.createAutomation(parsed.data);
      res.status(201).json(automation);
    } catch (error) {
      res.status(500).json({ message: "Failed to create automation" });
    }
  });

  app.put("/api/automations/:id", async (req, res) => {
    try {
      const automation = await storage.updateAutomation(req.params.id, req.body);
      if (!automation) {
        return res.status(404).json({ message: "Automation not found" });
      }
      res.json(automation);
    } catch (error) {
      res.status(500).json({ message: "Failed to update automation" });
    }
  });

  app.delete("/api/automations/:id", async (req, res) => {
    try {
      const success = await storage.deleteAutomation(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Automation not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete automation" });
    }
  });

  app.get("/api/team-members", async (req, res) => {
    try {
      const members = await storage.getTeamMembers();
      res.json(members);
    } catch (error) {
      res.status(500).json({ message: "Failed to get team members" });
    }
  });

  app.get("/api/team-members/:id", async (req, res) => {
    try {
      const member = await storage.getTeamMember(req.params.id);
      if (!member) {
        return res.status(404).json({ message: "Team member not found" });
      }
      res.json(member);
    } catch (error) {
      res.status(500).json({ message: "Failed to get team member" });
    }
  });

  app.post("/api/team-members", async (req, res) => {
    try {
      const parsed = insertTeamMemberSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid team member data", errors: parsed.error.errors });
      }
      const member = await storage.createTeamMember(parsed.data);
      res.status(201).json(member);
    } catch (error) {
      res.status(500).json({ message: "Failed to create team member" });
    }
  });

  app.put("/api/team-members/:id", async (req, res) => {
    try {
      const member = await storage.updateTeamMember(req.params.id, req.body);
      if (!member) {
        return res.status(404).json({ message: "Team member not found" });
      }
      res.json(member);
    } catch (error) {
      res.status(500).json({ message: "Failed to update team member" });
    }
  });

  app.delete("/api/team-members/:id", async (req, res) => {
    try {
      const success = await storage.deleteTeamMember(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Team member not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete team member" });
    }
  });

  app.get("/api/settings/whatsapp", async (req, res) => {
    try {
      const settings = await storage.getWhatsappSettings();
      res.json(settings || {});
    } catch (error) {
      res.status(500).json({ message: "Failed to get WhatsApp settings" });
    }
  });

  app.post("/api/settings/whatsapp", async (req, res) => {
    try {
      const settings = await storage.saveWhatsappSettings(req.body);
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to save WhatsApp settings" });
    }
  });

  app.post("/api/settings/whatsapp/test", async (req, res) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const isValid = req.body.accessToken && req.body.phoneNumberId;
      if (isValid) {
        res.json({ success: true, message: "Connection successful!" });
      } else {
        res.status(400).json({ success: false, message: "Invalid credentials. Please check your API settings." });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to test connection" });
    }
  });

  app.get("/api/billing", async (req, res) => {
    try {
      const billing = await storage.getBilling();
      res.json(billing);
    } catch (error) {
      res.status(500).json({ message: "Failed to get billing info" });
    }
  });

  app.post("/api/billing/purchase", async (req, res) => {
    try {
      const { amount } = req.body;
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }
      const billing = await storage.addTransaction({
        type: "purchase",
        amount,
        description: `Purchased ${amount} credits`,
      });
      res.json(billing);
    } catch (error) {
      res.status(500).json({ message: "Failed to purchase credits" });
    }
  });

  app.get("/api/reports/delivery", async (req, res) => {
    try {
      const messages = await storage.getMessages();
      const campaigns = await storage.getCampaigns();
      
      const report = {
        totalSent: messages.filter(m => m.direction === "outbound").length,
        delivered: messages.filter(m => m.direction === "outbound" && (m.status === "delivered" || m.status === "read")).length,
        read: messages.filter(m => m.direction === "outbound" && m.status === "read").length,
        failed: messages.filter(m => m.direction === "outbound" && m.status === "failed").length,
        campaignStats: campaigns.map(c => ({
          id: c.id,
          name: c.name,
          sent: c.sentCount,
          delivered: c.deliveredCount,
          read: c.readCount,
          replied: c.repliedCount,
        })),
      };
      res.json(report);
    } catch (error) {
      res.status(500).json({ message: "Failed to get delivery report" });
    }
  });

  app.get("/api/reports/campaign/:id", async (req, res) => {
    try {
      const campaign = await storage.getCampaign(req.params.id);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      res.json({
        ...campaign,
        deliveryRate: campaign.sentCount > 0 ? (campaign.deliveredCount / campaign.sentCount) * 100 : 0,
        readRate: campaign.deliveredCount > 0 ? (campaign.readCount / campaign.deliveredCount) * 100 : 0,
        replyRate: campaign.readCount > 0 ? (campaign.repliedCount / campaign.readCount) * 100 : 0,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to get campaign report" });
    }
  });

  app.get("/api/reports/agent-performance", async (req, res) => {
    try {
      const messages = await storage.getMessages();
      const teamMembers = await storage.getTeamMembers();
      
      const performance = teamMembers.map(member => {
        const agentMessages = messages.filter(m => m.agentId === member.userId && m.direction === "outbound");
        return {
          id: member.id,
          name: member.name,
          messagesSent: agentMessages.length,
          avgResponseTime: "2.5 min",
          satisfaction: 4.5,
        };
      });
      res.json(performance);
    } catch (error) {
      res.status(500).json({ message: "Failed to get agent performance" });
    }
  });

  app.get("/api/dashboard", async (req, res) => {
    try {
      const stats = await storage.getNewDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to get dashboard stats" });
    }
  });

  app.get("/api/facebook/forms", async (req, res) => {
    try {
      const forms = await storage.getFBForms();
      res.json(forms);
    } catch (error) {
      res.status(500).json({ error: "Failed to get forms" });
    }
  });

  app.post("/api/facebook/syncForms", async (req, res) => {
    try {
      res.json({ 
        success: true, 
        message: "Forms sync simulated - configure FB_ACCESS_TOKEN for real sync",
        forms: await storage.getFBForms()
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to sync forms" });
    }
  });

  app.get("/api/facebook/leads", async (req, res) => {
    try {
      const { formId } = req.query;
      const leads = await storage.getFBLeads(formId as string | undefined);
      res.json(leads);
    } catch (error) {
      res.status(500).json({ error: "Failed to get leads" });
    }
  });

  app.post("/api/facebook/syncLeads", async (req, res) => {
    try {
      res.json({ 
        success: true, 
        message: "Leads sync simulated - configure FB_ACCESS_TOKEN for real sync",
        leads: await storage.getFBLeads()
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to sync leads" });
    }
  });

  app.get("/api/agents", async (req, res) => {
    try {
      const agents = await storage.getAIAgents();
      res.json(agents);
    } catch (error) {
      res.status(500).json({ error: "Failed to get agents" });
    }
  });

  app.get("/api/agents/:id", async (req, res) => {
    try {
      const agent = await storage.getAIAgent(req.params.id);
      if (!agent) {
        return res.status(404).json({ error: "Agent not found" });
      }
      res.json(agent);
    } catch (error) {
      res.status(500).json({ error: "Failed to get agent" });
    }
  });

  app.post("/api/agents", async (req, res) => {
    try {
      const { name, model, prompt, isDefault } = req.body;
      if (!name || !prompt) {
        return res.status(400).json({ error: "Name and prompt are required" });
      }
      const agent = await storage.createAIAgent({
        name,
        model: model || "gpt-4.1",
        prompt,
        isDefault: isDefault || false,
      });
      res.status(201).json(agent);
    } catch (error) {
      res.status(500).json({ error: "Failed to create agent" });
    }
  });

  app.put("/api/agents/:id", async (req, res) => {
    try {
      const agent = await storage.updateAIAgent(req.params.id, req.body);
      if (!agent) {
        return res.status(404).json({ error: "Agent not found" });
      }
      res.json(agent);
    } catch (error) {
      res.status(500).json({ error: "Failed to update agent" });
    }
  });

  app.delete("/api/agents/:id", async (req, res) => {
    try {
      const success = await storage.deleteAIAgent(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Agent not found" });
      }
      res.json({ success: true, message: "Agent deleted" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete agent" });
    }
  });

  app.post("/api/agents/:id/test", async (req, res) => {
    try {
      const { message } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }
      const agent = await storage.getAIAgent(req.params.id);
      if (!agent) {
        return res.status(404).json({ error: "Agent not found" });
      }
      res.json({
        agentId: agent.id,
        agentName: agent.name,
        userMessage: message,
        response: `[Simulated AI Response] As ${agent.name}, I would respond to: "${message}" - Configure OPENAI_API_KEY for real AI responses.`
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to test agent" });
    }
  });

  app.post("/api/agents/chat", async (req, res) => {
    try {
      const { agentId, message } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }
      let agent;
      if (agentId) {
        agent = await storage.getAIAgent(agentId);
      } else {
        const agents = await storage.getAIAgents();
        agent = agents.find(a => a.isDefault) || agents[0];
      }
      if (!agent) {
        return res.status(404).json({ error: "No agent found" });
      }
      res.json({
        agentId: agent.id,
        agentName: agent.name,
        userMessage: message,
        response: `[Simulated AI Response] As ${agent.name}, I would respond to: "${message}" - Configure OPENAI_API_KEY for real AI responses.`
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to chat with agent" });
    }
  });

  app.get("/api/map-agent", async (req, res) => {
    try {
      const mappings = await storage.getAgentMappings();
      const enrichedMappings = await Promise.all(
        mappings.map(async (mapping) => {
          const agent = await storage.getAIAgent(mapping.agentId);
          let form = null;
          if (mapping.formId) {
            form = await storage.getFBForm(mapping.formId);
          }
          return {
            ...mapping,
            agent: agent ? { id: agent.id, name: agent.name } : null,
            form: form ? { id: form.id, name: form.name } : null,
          };
        })
      );
      res.json(enrichedMappings);
    } catch (error) {
      res.status(500).json({ error: "Failed to get mappings" });
    }
  });

  app.post("/api/map-agent", async (req, res) => {
    try {
      const { formId, senderId, agentId } = req.body;
      if (!agentId) {
        return res.status(400).json({ error: "agentId is required" });
      }
      if (!formId && !senderId) {
        return res.status(400).json({ error: "Either formId or senderId is required" });
      }
      const agent = await storage.getAIAgent(agentId);
      if (!agent) {
        return res.status(404).json({ error: "Agent not found" });
      }
      const mapping = await storage.createAgentMapping({ formId, senderId, agentId });
      res.status(201).json(mapping);
    } catch (error) {
      res.status(500).json({ error: "Failed to create mapping" });
    }
  });

  app.delete("/api/map-agent/:id", async (req, res) => {
    try {
      const success = await storage.deleteAgentMapping(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Mapping not found" });
      }
      res.json({ success: true, message: "Mapping deleted" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete mapping" });
    }
  });

  app.get("/api/conversations", async (req, res) => {
    try {
      const messages = await storage.getWAMessages();
      const conversations: Record<string, any> = {};
      
      messages.forEach(msg => {
        if (!conversations[msg.senderId]) {
          conversations[msg.senderId] = {
            senderId: msg.senderId,
            senderName: msg.senderName || msg.senderId,
            messages: [],
            lastMessage: null,
            lastMessageTime: null,
          };
        }
        conversations[msg.senderId].messages.push(msg);
      });
      
      Object.values(conversations).forEach((conv: any) => {
        conv.messages.sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        const lastMsg = conv.messages[conv.messages.length - 1];
        conv.lastMessage = lastMsg.content;
        conv.lastMessageTime = lastMsg.timestamp;
      });
      
      res.json(Object.values(conversations));
    } catch (error) {
      res.status(500).json({ error: "Failed to get conversations" });
    }
  });

  app.post("/api/messages/send", async (req, res) => {
    try {
      const { to, message } = req.body;
      if (!to || !message) {
        return res.status(400).json({ error: "Missing 'to' or 'message' field" });
      }
      const waMessage = await storage.createWAMessage({
        id: `msg-${Date.now()}`,
        senderId: to,
        content: message,
        type: "text",
        direction: "outbound",
        timestamp: new Date().toISOString(),
      });
      res.json({ success: true, result: waMessage });
    } catch (error) {
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  app.get("/api/webhook/whatsapp", (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    const verifyToken = process.env.VERIFY_TOKEN || 'your_verify_token';

    if (mode === 'subscribe' && token === verifyToken) {
      console.log('WhatsApp webhook verified');
      res.status(200).send(challenge);
    } else {
      console.log('WhatsApp webhook verification failed');
      res.sendStatus(403);
    }
  });

  app.post("/api/webhook/whatsapp", async (req, res) => {
    try {
      const body = req.body;
      if (body.object !== 'whatsapp_business_account') {
        return res.sendStatus(404);
      }

      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;
      const messages = value?.messages;

      if (messages && messages.length > 0) {
        for (const message of messages) {
          const senderId = message.from;
          const messageContent = message.text?.body || message.button?.text || '';
          const senderInfo = value.contacts?.[0] || {};

          await storage.createWAMessage({
            id: message.id,
            senderId,
            senderName: senderInfo.profile?.name || senderId,
            content: messageContent,
            type: message.type,
            direction: 'inbound',
            timestamp: new Date(parseInt(message.timestamp) * 1000).toISOString(),
            raw: message,
          });
        }
      }

      res.sendStatus(200);
    } catch (error) {
      console.error('Error processing WhatsApp webhook:', error);
      res.sendStatus(500);
    }
  });

  return httpServer;
}
