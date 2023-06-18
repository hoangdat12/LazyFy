import { Router } from 'express';
import CartController from '../controllers/cart.controller.js';

const router = Router();

// router.post('/create', CartController.createCartForUser);
router.post('/', CartController.addProductToCart);
router.delete('/:productId', CartController.deleteProductFromCart);
router.delete('/', CartController.deleteMultiProductFromCart);
router.patch('/', CartController.updateQuantity);
router.get('/:userId', CartController.getCart);

export default router;
