import { Router } from 'express';
import CartController from '../controllers/cart.controller.js';

const router = Router();

router.post('/create', CartController.createCartForUser);

export default router;
