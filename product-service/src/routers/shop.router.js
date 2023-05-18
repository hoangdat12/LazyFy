import { Router } from 'express';
import { asyncHandler } from '../helpers/asyncHandler.js';
import ShopController from '../controllers/shop.controller.js';

const router = Router();

router.post('/register', asyncHandler(ShopController.register));

export default router;
