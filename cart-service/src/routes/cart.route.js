import { Router } from 'express';
import CartController from '../controllers/cart.controller.js';
import verifyAccessToken from '../middleware/verifyAccessToken.js';
import { asyncHandler } from '../helpers/asyncHandler.js';

const router = Router();

// router.post('/create', CartController.createCartForUser);
router.use(verifyAccessToken);
router.post('/', asyncHandler(CartController.addProductToCart));
router.delete(
  '/delete/:productId',
  asyncHandler(CartController.deleteProductFromCart)
);
router.delete(
  '/delete-multi',
  asyncHandler(CartController.deleteMultiProductFromCart)
);
router.patch('/update/quantity', asyncHandler(CartController.updateQuantity));
router.get('/:userId', asyncHandler(CartController.getCart));

export default router;
