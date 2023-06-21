import { Router } from 'express';
import DiscountController from '../controllers/discount.controller.js';
import verifyAccessToken from '../middleware/verifyAccessToken.js';

const router = new Router();

// Discount
router.get('/effective', DiscountController.getAllDiscountEffective);

router.post('/product', DiscountController.getAllDiscountForProduct);
router.post('/shop', DiscountController.getAllDiscountForShop);

router.use(verifyAccessToken);
router.get('/user/:userId', DiscountController.findDiscountOfUser);

router.post('/create', DiscountController.createDiscount);

router.patch('/disable', DiscountController.disableDiscount);
router.patch('/update', DiscountController.modifyDiscountCode);

// Inven Discount
router.post('/inven/save', DiscountController.saveDiscount);
router.delete('/inven/delete', DiscountController.deleteDiscountFromInventory);

export default router;
