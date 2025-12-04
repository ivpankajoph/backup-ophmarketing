import crypto from 'crypto';
import { User } from '../storage/mongodb.adapter';

export interface AuthUser {
  id: string;
  username: string;
  name: string;
  email?: string;
  role: string;
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, hash] = storedHash.split(':');
  if (!salt || !hash) return false;
  const verifyHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return hash === verifyHash;
}

export async function findUserByUsername(username: string): Promise<any | null> {
  try {
    const user = await User.findOne({ username });
    return user;
  } catch (error) {
    console.error('[Auth] Error finding user:', error);
    return null;
  }
}

export async function findUserById(id: string): Promise<any | null> {
  try {
    const user = await User.findOne({ id });
    return user;
  } catch (error) {
    console.error('[Auth] Error finding user by id:', error);
    return null;
  }
}

export async function createUser(username: string, password: string, name: string, email?: string): Promise<AuthUser | null> {
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return null;
    }

    const id = crypto.randomUUID();
    const hashedPassword = hashPassword(password);
    
    const user = await User.create({
      id,
      username,
      password: hashedPassword,
      name,
      email: email || '',
      role: 'user',
      createdAt: new Date().toISOString(),
    });

    return {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  } catch (error) {
    console.error('[Auth] Error creating user:', error);
    return null;
  }
}

export async function validateLogin(username: string, password: string): Promise<AuthUser | null> {
  try {
    const user = await findUserByUsername(username);
    if (!user) {
      return null;
    }

    if (!verifyPassword(password, user.password)) {
      return null;
    }

    return {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  } catch (error) {
    console.error('[Auth] Error validating login:', error);
    return null;
  }
}

export async function ensureDefaultAdmin(): Promise<void> {
  try {
    const adminExists = await User.findOne({ username: 'admin@whatsapp.com' });
    if (!adminExists) {
      console.log('[Auth] Creating default admin user...');
      await createUser('admin@whatsapp.com', 'admin123', 'Admin', 'admin@whatsapp.com');
      console.log('[Auth] Default admin user created (admin@whatsapp.com / admin123)');
    }
  } catch (error) {
    console.error('[Auth] Error ensuring default admin:', error);
  }
}
