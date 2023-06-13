import { CREATED, OK } from '../core/success.response.js';
import DiscountService from '../services/discount.service.js';

class DiscountController {
  discountService = new DiscountService();

  /*
    1. Create new Discount [Shop | Amin]
    */
  static async createDiscount(req, res, next) {
    try {
      const payload = req.body;
      const user = req.user;
      return new CREATED(
        await DiscountService.createDiscount({ payload, user }),
        'Create new discount success!'
      ).send(res);
    } catch (err) {
      next(err);
    }
  }
  /*
    1. Get all Discount for Product [User | Shop | Admin]
  */
  static async getAllDiscountForProduct(req, res, next) {
    try {
      let { limit = 20, page = 1, apply = null } = req.query;
      if (!apply) {
        limit = limit / 2;
      }
      const { shopId, productId } = req.body;
      return new OK(
        await DiscountService.getAllDiscountCodeForProduct({
          shopId,
          productId,
          limit,
          page,
          apply,
        }),
        'All discount for Product'
      ).send(res);
    } catch (err) {
      next(err);
    }
  }

  /*
    1. Get all Discount for Product [User]
  */
  static async getAllDiscountEffective(req, res, next) {
    try {
      let { limit = 20, page = 1, apply = null } = req.query;
      if (!apply) {
        limit = limit / 2;
      }
      return new OK(
        await DiscountService.getAllDiscountEffective({
          limit,
          page,
          apply,
        }),
        'All discount for Product'
      ).send(res);
    } catch (err) {
      next(err);
    }
  }

  /*
    1. Get all Discount for Shop [User | Shop]
  */
  static async getAllDiscountForShop(req, res, next) {
    try {
      const { limit = 20, page = 1 } = req.query;
      const { shopId } = req.body;

      return new OK(
        await DiscountService.getAllDiscountForShop({
          shopId,
          limit,
          page,
        }),
        'Discount of Shop'
      ).send(res);
    } catch (err) {
      next(err);
    }
  }

  /*
    1. Save Discount code to inven Discount of User [User]
  */
  static async saveDiscount(req, res, next) {
    try {
      const user = req.user;
      const { discount_code } = req.body;
      return new OK(
        await DiscountService.saveDiscount({
          userId: user.id,
          discount_code,
        }),
        'Save discount success!'
      ).send(res);
    } catch (err) {
      next(err);
    }
  }

  /*
    1. Delete Discount code from inven Discount of User [User]
  */
  static async deleteDiscountFromInventory(req, res, next) {
    try {
      const user = req.user;
      const { discount_code } = req.body;

      return new OK(
        await DiscountService.deleteDiscountFromInventory({
          userId: user.id,
          discount_code,
        }),
        'Delete discount from Inven success!'
      ).send(res);
    } catch (err) {
      next(err);
    }
  }

  /*
    1. Disable Discount [Shop | Admin]
  */
  static async disableDiscount(req, res, next) {
    try {
      const user = req.user;
      const { discount_code, shopId } = req.body;

      return new OK(
        await DiscountService.disableDiscount({
          user: user,
          shopId,
          discount_code,
        }),
        'Disable Discount success!'
      ).send(res);
    } catch (err) {
      next(err);
    }
  }

  /*
    1. Modify Discount [Shop | Admin]
   *  Attribute list is allowed to update
   * discount_min_order_value
   * discount_max_order_value
   * discount_max_uses
   * discount_start_date
   * discount_end_date
  */
  static async modifyDiscountCode(req, res, next) {
    try {
      const user = req.user;
      const { shopId, discount_code, updatedDiscount } = req.body;

      return new OK(
        await DiscountService.modifyDiscountCode({
          userId: user.id,
          shopId,
          discount_code,
          updatedDiscount,
        }),
        'Modify Discount success!'
      ).send(res);
    } catch (err) {
      next(err);
    }
  }

  /*
    1. Find all Discount of User [User]
  */
  static async findDiscountOfUser(req, res, next) {
    try {
      const user = req.params.userId;

      return new OK(
        await DiscountService.getAllDiscountOfUser({
          userId: userid,
        }),
        'Discount of User'
      ).send(res);
    } catch (err) {
      next(err);
    }
  }
}

export default DiscountController;
