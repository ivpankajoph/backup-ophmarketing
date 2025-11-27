import * as fs from 'fs';
import * as path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function getFilePath(collection: string): string {
  return path.join(DATA_DIR, `${collection}.json`);
}

export function readCollection<T>(collection: string): T[] {
  ensureDataDir();
  const filePath = getFilePath(collection);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]');
    return [];
  }
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function writeCollection<T>(collection: string, data: T[]): void {
  ensureDataDir();
  const filePath = getFilePath(collection);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export function addItem<T extends { id: string }>(collection: string, item: T): T {
  const items = readCollection<T>(collection);
  items.push(item);
  writeCollection(collection, items);
  return item;
}

export function updateItem<T extends { id: string }>(collection: string, id: string, updates: Partial<T>): T | null {
  const items = readCollection<T>(collection);
  const index = items.findIndex(item => item.id === id);
  if (index === -1) return null;
  items[index] = { ...items[index], ...updates };
  writeCollection(collection, items);
  return items[index];
}

export function deleteItem<T extends { id: string }>(collection: string, id: string): boolean {
  const items = readCollection<T>(collection);
  const filtered = items.filter(item => item.id !== id);
  if (filtered.length === items.length) return false;
  writeCollection(collection, filtered);
  return true;
}

export function findById<T extends { id: string }>(collection: string, id: string): T | null {
  const items = readCollection<T>(collection);
  return items.find(item => item.id === id) || null;
}

export function findByField<T>(collection: string, field: keyof T, value: any): T | null {
  const items = readCollection<T>(collection);
  return items.find(item => item[field] === value) || null;
}
