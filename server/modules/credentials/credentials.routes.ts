import { Router, Request, Response } from 'express';
import { requireAuth, getUserId } from '../auth/auth.routes';
import * as credentialsService from './credentials.service';
import { decrypt } from '../encryption/encryption.service';

const router = Router();

function maskSecret(value: string | undefined): string {
  if (!value) return '';
  if (value.length <= 8) return '****';
  return value.substring(0, 4) + '****' + value.substring(value.length - 4);
}

function getEnvCredentials() {
  return {
    whatsappToken: process.env.WHATSAPP_TOKEN_NEW || process.env.WHATSAPP_TOKEN || '',
    phoneNumberId: process.env.PHONE_NUMBER_ID || '',
    businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || '',
    webhookVerifyToken: process.env.WEBHOOK_VERIFY_TOKEN || '',
    appId: process.env.FACEBOOK_APP_ID || '',
    appSecret: process.env.FACEBOOK_APP_SECRET || '',
    openaiApiKey: process.env.OPENAI_API_KEY || '',
    facebookAccessToken: process.env.FACEBOOK_ACCESS_TOKEN || '',
    facebookPageId: process.env.FACEBOOK_PAGE_ID || '',
  };
}

function getMaskedEnvCredentials() {
  const env = getEnvCredentials();
  return {
    whatsappToken: maskSecret(env.whatsappToken),
    phoneNumberId: maskSecret(env.phoneNumberId),
    businessAccountId: maskSecret(env.businessAccountId),
    webhookVerifyToken: maskSecret(env.webhookVerifyToken),
    appId: maskSecret(env.appId),
    appSecret: maskSecret(env.appSecret),
    openaiApiKey: maskSecret(env.openaiApiKey),
    facebookAccessToken: maskSecret(env.facebookAccessToken),
    facebookPageId: maskSecret(env.facebookPageId),
  };
}

function getEnvCredentialStatus() {
  const env = getEnvCredentials();
  return {
    hasWhatsApp: !!(env.whatsappToken && env.phoneNumberId),
    hasOpenAI: !!env.openaiApiKey,
    hasFacebook: !!env.facebookAccessToken,
    isVerified: true,
  };
}

router.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const stored = await credentialsService.getCredentialsByUserId(userId);
    
    if (!stored) {
      const envCreds = getEnvCredentials();
      const hasEnvCreds = !!(envCreds.whatsappToken || envCreds.openaiApiKey || envCreds.facebookAccessToken);
      
      if (hasEnvCreds) {
        return res.json({ 
          hasCredentials: true,
          source: 'environment',
          credentials: getMaskedEnvCredentials(),
          status: getEnvCredentialStatus(),
          isVerified: true,
        });
      }
      
      return res.json({ 
        hasCredentials: false,
        credentials: null,
        status: { hasWhatsApp: false, hasOpenAI: false, hasFacebook: false, isVerified: false }
      });
    }

    const masked = await credentialsService.getMaskedCredentialsForUser(userId);
    const status = await credentialsService.getCredentialStatus(userId);

    res.json({
      hasCredentials: true,
      source: 'database',
      credentials: masked,
      status,
      isVerified: stored.isVerified,
      lastVerifiedAt: stored.lastVerifiedAt,
    });
  } catch (error) {
    console.error('[Credentials API] Error fetching credentials:', error);
    res.status(500).json({ error: 'Failed to fetch credentials' });
  }
});

router.post('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const {
      whatsappToken,
      phoneNumberId,
      businessAccountId,
      webhookVerifyToken,
      appId,
      appSecret,
      openaiApiKey,
      facebookAccessToken,
      facebookPageId,
    } = req.body;

    const saved = await credentialsService.saveCredentials(userId, {
      whatsappToken,
      phoneNumberId,
      businessAccountId,
      webhookVerifyToken,
      appId,
      appSecret,
      openaiApiKey,
      facebookAccessToken,
      facebookPageId,
    });

    if (!saved) {
      return res.status(500).json({ error: 'Failed to save credentials' });
    }

    const masked = await credentialsService.getMaskedCredentialsForUser(userId);
    const status = await credentialsService.getCredentialStatus(userId);

    res.json({
      success: true,
      message: 'Credentials saved successfully',
      credentials: masked,
      status,
    });
  } catch (error) {
    console.error('[Credentials API] Error saving credentials:', error);
    res.status(500).json({ error: 'Failed to save credentials' });
  }
});

router.post('/test/whatsapp', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const creds = await credentialsService.getDecryptedCredentials(userId);
    if (!creds || !creds.whatsappToken || !creds.phoneNumberId) {
      return res.status(400).json({ error: 'WhatsApp credentials not configured' });
    }

    const testResponse = await fetch(
      `https://graph.facebook.com/v18.0/${creds.phoneNumberId}?fields=verified_name,display_phone_number`,
      {
        headers: {
          Authorization: `Bearer ${creds.whatsappToken}`,
        },
      }
    );

    if (!testResponse.ok) {
      const errorData = await testResponse.json();
      await credentialsService.updateVerificationStatus(userId, false);
      return res.status(400).json({ 
        error: 'WhatsApp API connection failed',
        details: errorData.error?.message || 'Invalid credentials'
      });
    }

    const data = await testResponse.json();
    await credentialsService.updateVerificationStatus(userId, true);

    res.json({
      success: true,
      message: 'WhatsApp API connection successful',
      phoneNumber: data.display_phone_number,
      verifiedName: data.verified_name,
    });
  } catch (error: any) {
    console.error('[Credentials API] WhatsApp test error:', error);
    const errorUserId = getUserId(req);
    if (errorUserId) {
      await credentialsService.updateVerificationStatus(errorUserId, false);
    }
    res.status(500).json({ error: 'Failed to test WhatsApp connection', details: error.message });
  }
});

router.post('/test/openai', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const creds = await credentialsService.getDecryptedCredentials(userId);
    if (!creds || !creds.openaiApiKey) {
      return res.status(400).json({ error: 'OpenAI API key not configured' });
    }

    const testResponse = await fetch('https://api.openai.com/v1/models', {
      headers: {
        Authorization: `Bearer ${creds.openaiApiKey}`,
      },
    });

    if (!testResponse.ok) {
      return res.status(400).json({ 
        error: 'OpenAI API connection failed',
        details: 'Invalid API key'
      });
    }

    res.json({
      success: true,
      message: 'OpenAI API connection successful',
    });
  } catch (error: any) {
    console.error('[Credentials API] OpenAI test error:', error);
    res.status(500).json({ error: 'Failed to test OpenAI connection', details: error.message });
  }
});

router.post('/test/facebook', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const creds = await credentialsService.getDecryptedCredentials(userId);
    if (!creds || !creds.facebookAccessToken) {
      return res.status(400).json({ error: 'Facebook access token not configured' });
    }

    const testResponse = await fetch(
      `https://graph.facebook.com/v18.0/me?fields=id,name&access_token=${creds.facebookAccessToken}`
    );

    if (!testResponse.ok) {
      return res.status(400).json({ 
        error: 'Facebook API connection failed',
        details: 'Invalid access token'
      });
    }

    const data = await testResponse.json();
    res.json({
      success: true,
      message: 'Facebook API connection successful',
      name: data.name,
    });
  } catch (error: any) {
    console.error('[Credentials API] Facebook test error:', error);
    res.status(500).json({ error: 'Failed to test Facebook connection', details: error.message });
  }
});

router.delete('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    await credentialsService.deleteCredentials(userId);
    res.json({ success: true, message: 'Credentials deleted successfully' });
  } catch (error) {
    console.error('[Credentials API] Error deleting credentials:', error);
    res.status(500).json({ error: 'Failed to delete credentials' });
  }
});

router.get('/status', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const status = await credentialsService.getCredentialStatus(userId);
    res.json(status);
  } catch (error) {
    console.error('[Credentials API] Error getting status:', error);
    res.status(500).json({ error: 'Failed to get credentials status' });
  }
});

export default router;
