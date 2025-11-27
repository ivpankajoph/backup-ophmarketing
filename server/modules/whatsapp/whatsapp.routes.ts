import { Router } from 'express';
import * as controller from './whatsapp.controller';

const router = Router();

router.get('/', controller.verifyWebhook);
router.post('/', controller.handleWebhook);
router.post('/send', controller.sendMessage);
router.get('/conversations', controller.getConversations);
router.get('/conversations/:phone', controller.getConversation);

export default router;
