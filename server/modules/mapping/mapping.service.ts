import { readCollection, writeCollection, addItem, updateItem, deleteItem, findById, findByField } from '../storage';

export interface AgentFormMapping {
  id: string;
  formId: string;
  formName: string;
  agentId: string;
  agentName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const COLLECTION = 'mapping';

function generateId(): string {
  return `map-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function getAllMappings(): AgentFormMapping[] {
  return readCollection<AgentFormMapping>(COLLECTION);
}

export function getMappingById(id: string): AgentFormMapping | null {
  return findById<AgentFormMapping>(COLLECTION, id);
}

export function getMappingByFormId(formId: string): AgentFormMapping | null {
  const mappings = readCollection<AgentFormMapping>(COLLECTION);
  return mappings.find(m => m.formId === formId && m.isActive) || null;
}

export function getMappingByAgentId(agentId: string): AgentFormMapping[] {
  const mappings = readCollection<AgentFormMapping>(COLLECTION);
  return mappings.filter(m => m.agentId === agentId);
}

export function createMapping(data: Omit<AgentFormMapping, 'id' | 'createdAt' | 'updatedAt'>): AgentFormMapping {
  const existingMappings = readCollection<AgentFormMapping>(COLLECTION);
  const existingForForm = existingMappings.find(m => m.formId === data.formId);
  
  if (existingForForm) {
    return updateMapping(existingForForm.id, {
      agentId: data.agentId,
      agentName: data.agentName,
      isActive: data.isActive,
    })!;
  }

  const now = new Date().toISOString();
  const mapping: AgentFormMapping = {
    id: generateId(),
    ...data,
    createdAt: now,
    updatedAt: now,
  };
  return addItem<AgentFormMapping>(COLLECTION, mapping);
}

export function updateMapping(id: string, data: Partial<Omit<AgentFormMapping, 'id' | 'createdAt'>>): AgentFormMapping | null {
  return updateItem<AgentFormMapping>(COLLECTION, id, {
    ...data,
    updatedAt: new Date().toISOString(),
  });
}

export function deleteMapping(id: string): boolean {
  return deleteItem<AgentFormMapping>(COLLECTION, id);
}
