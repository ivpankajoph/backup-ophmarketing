import { Router } from 'express';
import * as controller from './fb.controller';

const router = Router();

router.post('/forms/sync', controller.syncForms);
router.get('/forms', controller.listForms);
router.get('/forms/:id', controller.getForm);
router.post('/forms/:formId/sync-leads', controller.syncLeads);
router.get('/leads', controller.listLeads);
router.get('/leads/:id', controller.getLead);

export default router;
