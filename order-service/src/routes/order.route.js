import { Router } from 'express';
import CartController from '../controller/order.controller.js';
import { asyncHandler } from '../helpers/asyncHandler.js';
import verifyAccessToken from '../middleware/verifyAccessToken.js';

const router = new Router();

router.use(verifyAccessToken);
router.post('/checkout', asyncHandler(CartController.checkoutReview));
router.post('/', asyncHandler(CartController.order));
router.delete('/', asyncHandler(CartController.cancelOrder));
router.get('/:userId', asyncHandler(CartController.viewOrder));
router.get('/all/:userId', asyncHandler(CartController.viewAllOrder));

export default router;
