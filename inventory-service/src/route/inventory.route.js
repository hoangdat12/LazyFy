import { Router } from 'express';
import InventoryController from '../controller/inventory.controller.js';

const router = new Router();

router.post('/create', InventoryController.createInventoryForProduct);

export default router;
