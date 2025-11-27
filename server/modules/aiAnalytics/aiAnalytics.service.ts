import * as jsonAdapter from '../storage/json.adapter';

export interface AIChatQualification {
  id: string;
  contactId: string;
  phone: string;
  name: string;
  source: 'ai_chat' | 'campaign' | 'ad' | 'lead_form' | 'manual';
  campaignId?: string;
  campaignName?: string;
  agentId?: string;
  agentName?: string;
  category: 'interested' | 'not_interested' | 'pending';
  score: number; // 0-100 qualification score
  totalMessages: number;
  lastMessageAt: string;
  firstContactAt: string;
  keywords: string[]; // Keywords that indicate interest
  notes: string;
  aiAnalysis?: string; // AI-generated analysis of the conversation
  createdAt: string;
  updatedAt: string;
}

export interface QualificationStats {
  total: number;
  interested: number;
  notInterested: number;
  pending: number;
  interestedPercent: number;
  notInterestedPercent: number;
  pendingPercent: number;
}

// Interest keywords for AI to detect
const INTEREST_KEYWORDS = [
  'interested', 'yes', 'tell me more', 'how much', 'price', 'cost', 
  'register', 'sign up', 'book', 'schedule', 'appointment', 'buy',
  'purchase', 'order', 'want', 'need', 'looking for', 'details',
  'more information', 'brochure', 'catalog', 'demo', 'trial',
  'subscribe', 'join', 'apply', 'confirm', 'proceed', 'next steps'
];

const NOT_INTERESTED_KEYWORDS = [
  'not interested', 'no thanks', 'no thank you', 'stop', 'unsubscribe',
  'remove', 'don\'t contact', 'spam', 'wrong number', 'busy', 'later',
  'not now', 'maybe later', 'not looking', 'already have', 'not for me'
];

function generateId(): string {
  return 'qual_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

export function getQualifications(): AIChatQualification[] {
  return jsonAdapter.readCollection<AIChatQualification>('ai_qualifications');
}

export function getQualificationById(id: string): AIChatQualification | undefined {
  const qualifications = getQualifications();
  return qualifications.find(q => q.id === id);
}

export function getQualificationByPhone(phone: string): AIChatQualification | undefined {
  const qualifications = getQualifications();
  const normalizedPhone = phone.replace(/\D/g, '');
  return qualifications.find(q => q.phone.replace(/\D/g, '').includes(normalizedPhone) || 
    normalizedPhone.includes(q.phone.replace(/\D/g, '')));
}

export function getQualificationsByCategory(category: 'interested' | 'not_interested' | 'pending'): AIChatQualification[] {
  const qualifications = getQualifications();
  return qualifications.filter(q => q.category === category);
}

export function getQualificationsBySource(source: string): AIChatQualification[] {
  const qualifications = getQualifications();
  return qualifications.filter(q => q.source === source);
}

export function getQualificationsByCampaign(campaignId: string): AIChatQualification[] {
  const qualifications = getQualifications();
  return qualifications.filter(q => q.campaignId === campaignId);
}

export function getQualificationsByAgent(agentId: string): AIChatQualification[] {
  const qualifications = getQualifications();
  return qualifications.filter(q => q.agentId === agentId);
}

export function getQualificationStats(): QualificationStats {
  const qualifications = getQualifications();
  const total = qualifications.length;
  const interested = qualifications.filter(q => q.category === 'interested').length;
  const notInterested = qualifications.filter(q => q.category === 'not_interested').length;
  const pending = qualifications.filter(q => q.category === 'pending').length;
  
  return {
    total,
    interested,
    notInterested,
    pending,
    interestedPercent: total > 0 ? Math.round((interested / total) * 100) : 0,
    notInterestedPercent: total > 0 ? Math.round((notInterested / total) * 100) : 0,
    pendingPercent: total > 0 ? Math.round((pending / total) * 100) : 0
  };
}

export function analyzeMessage(message: string): { category: 'interested' | 'not_interested' | 'pending'; score: number; keywords: string[] } {
  const lowerMessage = message.toLowerCase();
  const foundInterestKeywords: string[] = [];
  const foundNotInterestedKeywords: string[] = [];
  
  // Check for interest keywords
  for (const keyword of INTEREST_KEYWORDS) {
    if (lowerMessage.includes(keyword.toLowerCase())) {
      foundInterestKeywords.push(keyword);
    }
  }
  
  // Check for not interested keywords
  for (const keyword of NOT_INTERESTED_KEYWORDS) {
    if (lowerMessage.includes(keyword.toLowerCase())) {
      foundNotInterestedKeywords.push(keyword);
    }
  }
  
  // Calculate score and category
  let score = 50; // Start neutral
  let category: 'interested' | 'not_interested' | 'pending' = 'pending';
  
  if (foundNotInterestedKeywords.length > 0) {
    score = Math.max(0, 50 - (foundNotInterestedKeywords.length * 20));
    category = 'not_interested';
  } else if (foundInterestKeywords.length > 0) {
    score = Math.min(100, 50 + (foundInterestKeywords.length * 15));
    category = 'interested';
  }
  
  return {
    category,
    score,
    keywords: [...foundInterestKeywords, ...foundNotInterestedKeywords]
  };
}

export function createOrUpdateQualification(
  phone: string,
  name: string,
  message: string,
  source: 'ai_chat' | 'campaign' | 'ad' | 'lead_form' | 'manual',
  options?: {
    campaignId?: string;
    campaignName?: string;
    agentId?: string;
    agentName?: string;
    contactId?: string;
  }
): AIChatQualification {
  const qualifications = getQualifications();
  const existing = getQualificationByPhone(phone);
  const analysis = analyzeMessage(message);
  const now = new Date().toISOString();
  
  if (existing) {
    // Update existing qualification
    const updatedKeywords = Array.from(new Set([...existing.keywords, ...analysis.keywords]));
    
    // If new message shows stronger signal, update category
    let newCategory = existing.category;
    let newScore = existing.score;
    
    if (analysis.category === 'interested' && analysis.score > existing.score) {
      newCategory = 'interested';
      newScore = analysis.score;
    } else if (analysis.category === 'not_interested') {
      newCategory = 'not_interested';
      newScore = analysis.score;
    } else if (existing.category === 'pending' && analysis.category !== 'pending') {
      newCategory = analysis.category;
      newScore = analysis.score;
    }
    
    const updated: AIChatQualification = {
      ...existing,
      category: newCategory,
      score: newScore,
      totalMessages: existing.totalMessages + 1,
      lastMessageAt: now,
      keywords: updatedKeywords,
      updatedAt: now,
      // Update campaign/agent info if provided
      campaignId: options?.campaignId || existing.campaignId,
      campaignName: options?.campaignName || existing.campaignName,
      agentId: options?.agentId || existing.agentId,
      agentName: options?.agentName || existing.agentName,
    };
    
    const index = qualifications.findIndex(q => q.id === existing.id);
    qualifications[index] = updated;
    jsonAdapter.writeCollection('ai_qualifications', qualifications);
    
    return updated;
  } else {
    // Create new qualification
    const newQualification: AIChatQualification = {
      id: generateId(),
      contactId: options?.contactId || generateId(),
      phone,
      name,
      source,
      campaignId: options?.campaignId,
      campaignName: options?.campaignName,
      agentId: options?.agentId,
      agentName: options?.agentName,
      category: analysis.category,
      score: analysis.score,
      totalMessages: 1,
      lastMessageAt: now,
      firstContactAt: now,
      keywords: analysis.keywords,
      notes: '',
      createdAt: now,
      updatedAt: now,
    };
    
    qualifications.push(newQualification);
    jsonAdapter.writeCollection('ai_qualifications', qualifications);
    
    return newQualification;
  }
}

export function updateQualificationCategory(
  id: string, 
  category: 'interested' | 'not_interested' | 'pending',
  notes?: string
): AIChatQualification | null {
  const qualifications = getQualifications();
  const index = qualifications.findIndex(q => q.id === id);
  
  if (index === -1) return null;
  
  qualifications[index] = {
    ...qualifications[index],
    category,
    notes: notes || qualifications[index].notes,
    updatedAt: new Date().toISOString(),
  };
  
  jsonAdapter.writeCollection('ai_qualifications', qualifications);
  return qualifications[index];
}

export function updateQualificationNotes(id: string, notes: string): AIChatQualification | null {
  const qualifications = getQualifications();
  const index = qualifications.findIndex(q => q.id === id);
  
  if (index === -1) return null;
  
  qualifications[index] = {
    ...qualifications[index],
    notes,
    updatedAt: new Date().toISOString(),
  };
  
  jsonAdapter.writeCollection('ai_qualifications', qualifications);
  return qualifications[index];
}

export function deleteQualification(id: string): boolean {
  const qualifications = getQualifications();
  const filtered = qualifications.filter(q => q.id !== id);
  
  if (filtered.length === qualifications.length) return false;
  
  jsonAdapter.writeCollection('ai_qualifications', filtered);
  return true;
}

// Get report data grouped by source
export function getQualificationReport(): {
  bySource: Record<string, QualificationStats>;
  byCampaign: Record<string, QualificationStats & { campaignName: string }>;
  byAgent: Record<string, QualificationStats & { agentName: string }>;
  overall: QualificationStats;
} {
  const qualifications = getQualifications();
  
  // Group by source
  const bySource: Record<string, QualificationStats> = {};
  const sources = ['ai_chat', 'campaign', 'ad', 'lead_form', 'manual'];
  
  for (const source of sources) {
    const sourceQuals = qualifications.filter(q => q.source === source);
    const total = sourceQuals.length;
    const interested = sourceQuals.filter(q => q.category === 'interested').length;
    const notInterested = sourceQuals.filter(q => q.category === 'not_interested').length;
    const pending = sourceQuals.filter(q => q.category === 'pending').length;
    
    bySource[source] = {
      total,
      interested,
      notInterested,
      pending,
      interestedPercent: total > 0 ? Math.round((interested / total) * 100) : 0,
      notInterestedPercent: total > 0 ? Math.round((notInterested / total) * 100) : 0,
      pendingPercent: total > 0 ? Math.round((pending / total) * 100) : 0
    };
  }
  
  // Group by campaign
  const byCampaign: Record<string, QualificationStats & { campaignName: string }> = {};
  const campaignIds = Array.from(new Set(qualifications.filter(q => q.campaignId).map(q => q.campaignId!)));
  
  for (const campaignId of campaignIds) {
    const campaignQuals = qualifications.filter(q => q.campaignId === campaignId);
    const total = campaignQuals.length;
    const interested = campaignQuals.filter(q => q.category === 'interested').length;
    const notInterested = campaignQuals.filter(q => q.category === 'not_interested').length;
    const pending = campaignQuals.filter(q => q.category === 'pending').length;
    
    byCampaign[campaignId] = {
      campaignName: campaignQuals[0]?.campaignName || 'Unknown Campaign',
      total,
      interested,
      notInterested,
      pending,
      interestedPercent: total > 0 ? Math.round((interested / total) * 100) : 0,
      notInterestedPercent: total > 0 ? Math.round((notInterested / total) * 100) : 0,
      pendingPercent: total > 0 ? Math.round((pending / total) * 100) : 0
    };
  }
  
  // Group by agent
  const byAgent: Record<string, QualificationStats & { agentName: string }> = {};
  const agentIds = Array.from(new Set(qualifications.filter(q => q.agentId).map(q => q.agentId!)));
  
  for (const agentId of agentIds) {
    const agentQuals = qualifications.filter(q => q.agentId === agentId);
    const total = agentQuals.length;
    const interested = agentQuals.filter(q => q.category === 'interested').length;
    const notInterested = agentQuals.filter(q => q.category === 'not_interested').length;
    const pending = agentQuals.filter(q => q.category === 'pending').length;
    
    byAgent[agentId] = {
      agentName: agentQuals[0]?.agentName || 'Unknown Agent',
      total,
      interested,
      notInterested,
      pending,
      interestedPercent: total > 0 ? Math.round((interested / total) * 100) : 0,
      notInterestedPercent: total > 0 ? Math.round((notInterested / total) * 100) : 0,
      pendingPercent: total > 0 ? Math.round((pending / total) * 100) : 0
    };
  }
  
  return {
    bySource,
    byCampaign,
    byAgent,
    overall: getQualificationStats()
  };
}
