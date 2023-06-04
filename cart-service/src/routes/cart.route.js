import { Router } from 'express';

const router = Router();

router.use('/', CartController.testController);

export default router;
