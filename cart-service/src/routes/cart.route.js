import { Router } from 'express';
import CartController from '../controllers/cart.controller.js';

const router = Router();

router.use('/', CartController.testController);

export default router;
