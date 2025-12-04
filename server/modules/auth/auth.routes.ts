import { Router, Request, Response, NextFunction } from 'express';
import session from 'express-session';
import * as authService from './auth.service';

export interface SessionData {
  userId?: string;
  user?: authService.AuthUser;
}

declare module 'express-session' {
  interface SessionData {
    userId?: string;
    user?: authService.AuthUser;
  }
}

const router = Router();

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const sess = req.session as session.Session & SessionData;
  if (!sess?.userId) {
    return res.status(401).json({ error: 'Unauthorized. Please log in.' });
  }
  next();
}

export function getUserId(req: Request): string | null {
  const sess = req.session as session.Session & SessionData;
  return sess?.userId || null;
}

export function getUser(req: Request): authService.AuthUser | null {
  const sess = req.session as session.Session & SessionData;
  return sess?.user || null;
}

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = await authService.validateLogin(username, password);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const sess = req.session as session.Session & SessionData;
    sess.userId = user.id;
    sess.user = user;

    res.json({ 
      success: true, 
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });
  } catch (error) {
    console.error('[Auth] Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, password, name, email } = req.body;
    
    if (!username || !password || !name) {
      return res.status(400).json({ error: 'Username, password, and name are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const user = await authService.createUser(username, password, name, email);
    
    if (!user) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    const sess = req.session as session.Session & SessionData;
    sess.userId = user.id;
    sess.user = user;

    res.json({ 
      success: true, 
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });
  } catch (error) {
    console.error('[Auth] Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/logout', (req: Request, res: Response) => {
  req.session.destroy((err: Error | null) => {
    if (err) {
      console.error('[Auth] Logout error:', err);
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ success: true });
  });
});

router.get('/me', (req: Request, res: Response) => {
  const sess = req.session as session.Session & SessionData;
  if (!sess?.userId || !sess?.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  res.json({
    user: sess.user
  });
});

router.get('/check', (req: Request, res: Response) => {
  const sess = req.session as session.Session & SessionData;
  res.json({
    authenticated: !!sess?.userId,
    user: sess?.user || null
  });
});

export default router;
