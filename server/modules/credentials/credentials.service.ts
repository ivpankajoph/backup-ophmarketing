import crypto from 'crypto';
import { UserCredentials } from '../storage/mongodb.adapter';
import { encrypt, decrypt, encryptCredentials, decryptCredentials, getMaskedCredentials, EncryptedCredentials, DecryptedCredentials } from '../encryption/encryption.service';

export interface CredentialInput {
  whatsappToken?: string;
  phoneNumberId?: string;
  businessAccountId?: string;
  webhookVerifyToken?: string;
  appId?: string;
  appSecret?: string;
  openaiApiKey?: string;
  facebookAccessToken?: string;
  facebookPageId?: string;
}

export interface StoredCredentials {
  id: string;
  userId: string;
  whatsappToken?: string;
  phoneNumberId?: string;
  businessAccountId?: string;
  webhookVerifyToken?: string;
  appId?: string;
  appSecret?: string;
  openaiApiKey?: string;
  facebookAccessToken?: string;
  facebookPageId?: string;
  isVerified: boolean;
  lastVerifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export async function getCredentialsByUserId(userId: string): Promise<StoredCredentials | null> {
  try {
    const creds = await UserCredentials.findOne({ userId });
    if (!creds) return null;
    return creds.toObject() as StoredCredentials;
  } catch (error) {
    console.error('[Credentials] Error getting credentials:', error);
    return null;
  }
}

export async function getDecryptedCredentials(userId: string): Promise<DecryptedCredentials | null> {
  try {
    const stored = await getCredentialsByUserId(userId);
    if (!stored) return null;
    
    return {
      whatsappToken: stored.whatsappToken ? decrypt(stored.whatsappToken) : '',
      phoneNumberId: stored.phoneNumberId ? decrypt(stored.phoneNumberId) : '',
      businessAccountId: stored.businessAccountId ? decrypt(stored.businessAccountId) : '',
      webhookVerifyToken: stored.webhookVerifyToken ? decrypt(stored.webhookVerifyToken) : '',
      appId: stored.appId ? decrypt(stored.appId) : '',
      appSecret: stored.appSecret ? decrypt(stored.appSecret) : '',
      openaiApiKey: stored.openaiApiKey ? decrypt(stored.openaiApiKey) : '',
      facebookAccessToken: stored.facebookAccessToken ? decrypt(stored.facebookAccessToken) : '',
      facebookPageId: stored.facebookPageId ? decrypt(stored.facebookPageId) : '',
    };
  } catch (error) {
    console.error('[Credentials] Error decrypting credentials:', error);
    return null;
  }
}

export async function getMaskedCredentialsForUser(userId: string): Promise<Record<string, string> | null> {
  try {
    const stored = await getCredentialsByUserId(userId);
    if (!stored) return null;
    
    return getMaskedCredentials({
      whatsappToken: stored.whatsappToken,
      phoneNumberId: stored.phoneNumberId,
      businessAccountId: stored.businessAccountId,
      webhookVerifyToken: stored.webhookVerifyToken,
      appId: stored.appId,
      appSecret: stored.appSecret,
      openaiApiKey: stored.openaiApiKey,
      facebookAccessToken: stored.facebookAccessToken,
      facebookPageId: stored.facebookPageId,
    });
  } catch (error) {
    console.error('[Credentials] Error masking credentials:', error);
    return null;
  }
}

export async function saveCredentials(userId: string, input: CredentialInput): Promise<StoredCredentials | null> {
  try {
    const now = new Date().toISOString();
    const existing = await UserCredentials.findOne({ userId });
    
    const encryptedData: Record<string, string> = {};
    if (input.whatsappToken) encryptedData.whatsappToken = encrypt(input.whatsappToken);
    if (input.phoneNumberId) encryptedData.phoneNumberId = encrypt(input.phoneNumberId);
    if (input.businessAccountId) encryptedData.businessAccountId = encrypt(input.businessAccountId);
    if (input.webhookVerifyToken) encryptedData.webhookVerifyToken = encrypt(input.webhookVerifyToken);
    if (input.appId) encryptedData.appId = encrypt(input.appId);
    if (input.appSecret) encryptedData.appSecret = encrypt(input.appSecret);
    if (input.openaiApiKey) encryptedData.openaiApiKey = encrypt(input.openaiApiKey);
    if (input.facebookAccessToken) encryptedData.facebookAccessToken = encrypt(input.facebookAccessToken);
    if (input.facebookPageId) encryptedData.facebookPageId = encrypt(input.facebookPageId);
    
    if (existing) {
      const updateData: Record<string, any> = {
        ...encryptedData,
        updatedAt: now,
      };
      
      await UserCredentials.updateOne(
        { userId },
        { $set: updateData }
      );
      
      const updated = await UserCredentials.findOne({ userId });
      return updated ? updated.toObject() as StoredCredentials : null;
    } else {
      const newCreds = await UserCredentials.create({
        id: crypto.randomUUID(),
        userId,
        ...encryptedData,
        isVerified: false,
        createdAt: now,
        updatedAt: now,
      });
      return newCreds.toObject() as StoredCredentials;
    }
  } catch (error) {
    console.error('[Credentials] Error saving credentials:', error);
    return null;
  }
}

export async function updateVerificationStatus(userId: string, isVerified: boolean): Promise<boolean> {
  try {
    const now = new Date().toISOString();
    await UserCredentials.updateOne(
      { userId },
      { 
        $set: { 
          isVerified,
          lastVerifiedAt: isVerified ? now : undefined,
          updatedAt: now,
        }
      }
    );
    return true;
  } catch (error) {
    console.error('[Credentials] Error updating verification status:', error);
    return false;
  }
}

export async function deleteCredentials(userId: string): Promise<boolean> {
  try {
    await UserCredentials.deleteOne({ userId });
    return true;
  } catch (error) {
    console.error('[Credentials] Error deleting credentials:', error);
    return false;
  }
}

export async function getCredentialsByPhoneNumberId(phoneNumberId: string): Promise<{ userId: string; credentials: DecryptedCredentials } | null> {
  try {
    const allCreds = await UserCredentials.find({});
    
    for (const cred of allCreds) {
      if (cred.phoneNumberId) {
        const decryptedPhoneId = decrypt(cred.phoneNumberId);
        if (decryptedPhoneId === phoneNumberId) {
          const decrypted = await getDecryptedCredentials(cred.userId);
          if (decrypted) {
            return { userId: cred.userId, credentials: decrypted };
          }
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error('[Credentials] Error finding credentials by phone ID:', error);
    return null;
  }
}

export async function hasCredentials(userId: string): Promise<boolean> {
  try {
    const creds = await UserCredentials.findOne({ userId });
    return !!creds;
  } catch (error) {
    return false;
  }
}

export async function getCredentialStatus(userId: string): Promise<{
  hasWhatsApp: boolean;
  hasOpenAI: boolean;
  hasFacebook: boolean;
  isVerified: boolean;
}> {
  try {
    const creds = await getCredentialsByUserId(userId);
    if (!creds) {
      return { hasWhatsApp: false, hasOpenAI: false, hasFacebook: false, isVerified: false };
    }
    
    return {
      hasWhatsApp: !!(creds.whatsappToken && creds.phoneNumberId),
      hasOpenAI: !!creds.openaiApiKey,
      hasFacebook: !!creds.facebookAccessToken,
      isVerified: creds.isVerified,
    };
  } catch (error) {
    return { hasWhatsApp: false, hasOpenAI: false, hasFacebook: false, isVerified: false };
  }
}
