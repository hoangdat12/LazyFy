import { Router } from 'express';
import CartController from '../controller/order.controller.js';

const router = new Router();

router.post('/checkout', CartController.checkoutReview);
router.post('/', CartController.order);

export default router;
