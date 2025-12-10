import { Router, Request, Response, NextFunction } from 'express';
import * as controller from './whatsapp.controller';
import * as flowsController from './flows.controller';
import { requireAuth } from '../auth/auth.routes';

const router = Router();

router.get('/', controller.verifyWebhook);
router.post('/', controller.handleWebhook);
router.post('/send', requireAuth, controller.sendMessage);
router.post('/send-template', requireAuth, controller.sendTemplateMessageEndpoint);
router.get('/conversations', controller.getConversations);
router.get('/conversations/:phone', controller.getConversation);
router.get('/media/:mediaId', requireAuth, controller.getMediaUrl);

router.post('/flows/sync', requireAuth, flowsController.syncFlows);
router.get('/flows', requireAuth, flowsController.getFlows);
router.get('/flows/stats', requireAuth, flowsController.getFlowStats);
router.get('/flows/sync-status', requireAuth, flowsController.getSyncStatus);
router.get('/flows/:id', requireAuth, flowsController.getFlowById);
router.put('/flows/:id/entry-points', requireAuth, flowsController.updateEntryPoints);
router.post('/flows/:id/attach-template', requireAuth, flowsController.attachToTemplate);
router.delete('/flows/:id/attach-template/:templateId', requireAuth, flowsController.detachFromTemplate);
router.post('/flows/:id/attach-agent', requireAuth, flowsController.attachToAgent);
router.delete('/flows/:id/attach-agent/:agentId', requireAuth, flowsController.detachFromAgent);
router.post('/flows/:id/send', requireAuth, flowsController.sendFlow);
router.delete('/flows/:id', requireAuth, flowsController.deleteFlow);

export default router;
