import { Router } from 'express';
import * as controller from './agent.controller';

const router = Router();

router.get('/', controller.listAgents);
router.get('/:id', controller.getAgent);
router.post('/', controller.createAgent);
router.put('/:id', controller.updateAgent);
router.delete('/:id', controller.deleteAgent);
router.post('/:id/test', controller.testAgent);

export default router;
