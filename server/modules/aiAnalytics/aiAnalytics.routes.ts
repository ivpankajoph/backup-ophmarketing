import { Router, Request, Response } from 'express';
import * as aiAnalyticsService from './aiAnalytics.service';

const router = Router();

router.get('/qualifications', (req: Request, res: Response) => {
  try {
    const { category, source, campaignId, agentId } = req.query;
    
    let qualifications = aiAnalyticsService.getQualifications();
    
    if (category && typeof category === 'string') {
      qualifications = qualifications.filter(q => q.category === category);
    }
    
    if (source && typeof source === 'string') {
      qualifications = qualifications.filter(q => q.source === source);
    }
    
    if (campaignId && typeof campaignId === 'string') {
      qualifications = qualifications.filter(q => q.campaignId === campaignId);
    }
    
    if (agentId && typeof agentId === 'string') {
      qualifications = qualifications.filter(q => q.agentId === agentId);
    }
    
    qualifications.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    
    res.json(qualifications);
  } catch (error) {
    console.error('Error getting qualifications:', error);
    res.status(500).json({ error: 'Failed to get qualifications' });
  }
});

router.get('/qualifications/stats', (req: Request, res: Response) => {
  try {
    const stats = aiAnalyticsService.getQualificationStats();
    res.json(stats);
  } catch (error) {
    console.error('Error getting qualification stats:', error);
    res.status(500).json({ error: 'Failed to get qualification stats' });
  }
});

router.get('/qualifications/report', (req: Request, res: Response) => {
  try {
    const report = aiAnalyticsService.getQualificationReport();
    res.json(report);
  } catch (error) {
    console.error('Error getting qualification report:', error);
    res.status(500).json({ error: 'Failed to get qualification report' });
  }
});

router.get('/qualifications/:id', (req: Request, res: Response) => {
  try {
    const qualification = aiAnalyticsService.getQualificationById(req.params.id);
    if (!qualification) {
      return res.status(404).json({ error: 'Qualification not found' });
    }
    res.json(qualification);
  } catch (error) {
    console.error('Error getting qualification:', error);
    res.status(500).json({ error: 'Failed to get qualification' });
  }
});

router.post('/qualifications', (req: Request, res: Response) => {
  try {
    const { phone, name, message, source, campaignId, campaignName, agentId, agentName, contactId } = req.body;
    
    if (!phone || !name) {
      return res.status(400).json({ error: 'Phone and name are required' });
    }
    
    const qualification = aiAnalyticsService.createOrUpdateQualification(
      phone,
      name,
      message || '',
      source || 'manual',
      { campaignId, campaignName, agentId, agentName, contactId }
    );
    
    res.status(201).json(qualification);
  } catch (error) {
    console.error('Error creating qualification:', error);
    res.status(500).json({ error: 'Failed to create qualification' });
  }
});

router.put('/qualifications/:id/category', (req: Request, res: Response) => {
  try {
    const { category, notes } = req.body;
    
    if (!category || !['interested', 'not_interested', 'pending'].includes(category)) {
      return res.status(400).json({ error: 'Valid category is required (interested, not_interested, pending)' });
    }
    
    const qualification = aiAnalyticsService.updateQualificationCategory(req.params.id, category, notes);
    if (!qualification) {
      return res.status(404).json({ error: 'Qualification not found' });
    }
    
    res.json(qualification);
  } catch (error) {
    console.error('Error updating qualification category:', error);
    res.status(500).json({ error: 'Failed to update qualification category' });
  }
});

router.put('/qualifications/:id/notes', (req: Request, res: Response) => {
  try {
    const { notes } = req.body;
    
    const qualification = aiAnalyticsService.updateQualificationNotes(req.params.id, notes || '');
    if (!qualification) {
      return res.status(404).json({ error: 'Qualification not found' });
    }
    
    res.json(qualification);
  } catch (error) {
    console.error('Error updating qualification notes:', error);
    res.status(500).json({ error: 'Failed to update qualification notes' });
  }
});

router.delete('/qualifications/:id', (req: Request, res: Response) => {
  try {
    const success = aiAnalyticsService.deleteQualification(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Qualification not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting qualification:', error);
    res.status(500).json({ error: 'Failed to delete qualification' });
  }
});

router.get('/qualifications/by-phone/:phone', (req: Request, res: Response) => {
  try {
    const qualification = aiAnalyticsService.getQualificationByPhone(req.params.phone);
    if (!qualification) {
      return res.status(404).json({ error: 'Qualification not found for this phone' });
    }
    res.json(qualification);
  } catch (error) {
    console.error('Error getting qualification by phone:', error);
    res.status(500).json({ error: 'Failed to get qualification' });
  }
});

export default router;
