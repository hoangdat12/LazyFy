import { Router } from 'express';
import DiscountController from '../controllers/discount.controller.js';

const router = new Router();

// Discount
router.post('/create', DiscountController.createDiscount);
router.post('/product', DiscountController.getAllDiscountForProduct);
router.post('/shop', DiscountController.getAllDiscountForShop);

router.get('/user/:userId', DiscountController.findDiscountOfUser);
router.get('/effective', DiscountController.getAllDiscountEffective);

router.patch('/disable', DiscountController.disableDiscount);
router.patch('/update', DiscountController.modifyDiscountCode);

// Inven Discount
router.post('/inven/save', DiscountController.saveDiscount);
router.delete('/inven/delete', DiscountController.deleteDiscountFromInventory);
export default router;
