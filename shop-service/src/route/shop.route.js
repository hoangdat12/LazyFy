import ShopController from '../controller/shop.controller.js';
import { Router } from 'express';
import { asyncHandler } from '../helpers/asyncHandler.js';
import verifyAccessToken from '../middleware/verifyAccessToken.js';

const router = new Router();

router.use(verifyAccessToken);
router.post('/register', asyncHandler(ShopController.createNewShop));

export default router;
