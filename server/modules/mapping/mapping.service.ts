import { readCollection, addItem, updateItem, deleteItem, findById } from '../storage';

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

export async function getAllMappings(): Promise<AgentFormMapping[]> {
  return readCollection<AgentFormMapping>(COLLECTION);
}

export async function getMappingById(id: string): Promise<AgentFormMapping | null> {
  return findById<AgentFormMapping>(COLLECTION, id);
}

export async function getMappingByFormId(formId: string): Promise<AgentFormMapping | null> {
  const mappings = await readCollection<AgentFormMapping>(COLLECTION);
  return mappings.find(m => m.formId === formId && m.isActive) || null;
}

export async function getMappingByAgentId(agentId: string): Promise<AgentFormMapping[]> {
  const mappings = await readCollection<AgentFormMapping>(COLLECTION);
  return mappings.filter(m => m.agentId === agentId);
}

export async function createMapping(data: Omit<AgentFormMapping, 'id' | 'createdAt' | 'updatedAt'>): Promise<AgentFormMapping> {
  const existingMappings = await readCollection<AgentFormMapping>(COLLECTION);
  const existingForForm = existingMappings.find(m => m.formId === data.formId);
  
  if (existingForForm) {
    const updated = await updateMapping(existingForForm.id, {
      agentId: data.agentId,
      agentName: data.agentName,
      isActive: data.isActive,
    });
    return updated!;
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

export async function updateMapping(id: string, data: Partial<Omit<AgentFormMapping, 'id' | 'createdAt'>>): Promise<AgentFormMapping | null> {
  return updateItem<AgentFormMapping>(COLLECTION, id, {
    ...data,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteMapping(id: string): Promise<boolean> {
  return deleteItem<AgentFormMapping>(COLLECTION, id);
}
