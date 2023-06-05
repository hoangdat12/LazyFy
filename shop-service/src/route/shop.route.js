import ShopController from '../controller/shop.controller.js';
import { Router } from 'express';
const router = new Router();

router.post('/register', ShopController.createNewShop);

export default router;
