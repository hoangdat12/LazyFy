import { Router } from 'express';
import InventoryController from '../controller/inventory.controller.js';
import verifyAccessToken from '../middleware/verifyAccessToken.js';
import { asyncHandler } from '../helpers/asyncHandler.js';

const router = new Router();

// router.post('/create', InventoryController.createInventoryForProduct);
router.use(verifyAccessToken);
router.patch('/', asyncHandler(InventoryController.increQuantity));

export default router;
