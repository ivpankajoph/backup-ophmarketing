import * as mongodb from './mongodb.adapter';

export async function readCollection<T>(collection: string): Promise<T[]> {
  return mongodb.readCollection<T>(collection);
}

export async function writeCollection<T>(collection: string, data: T[]): Promise<void> {
  return mongodb.writeCollection<T>(collection, data);
}

export async function addItem<T extends { id: string }>(collection: string, item: T): Promise<T> {
  const result = await mongodb.insertOne<T>(collection, item);
  return result || item;
}

export async function updateItem<T extends { id: string }>(collection: string, id: string, updates: Partial<T>): Promise<T | null> {
  return mongodb.updateOne<T>(collection, { id }, updates);
}

export async function deleteItem<T extends { id: string }>(collection: string, id: string): Promise<boolean> {
  return mongodb.deleteOne(collection, { id });
}

export async function findById<T extends { id: string }>(collection: string, id: string): Promise<T | null> {
  return mongodb.findOne<T>(collection, { id });
}

export async function findByField<T>(collection: string, field: keyof T, value: any): Promise<T | null> {
  return mongodb.findOne<T>(collection, { [field]: value });
}

export async function updateManyItems(collection: string, query: Record<string, any>, updates: Record<string, any>): Promise<number> {
  return mongodb.updateMany(collection, query, updates);
}

export { connectToMongoDB } from './mongodb.adapter';
