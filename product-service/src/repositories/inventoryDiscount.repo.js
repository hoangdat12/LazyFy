import { _InventoryDiscount } from '../models/discount.model.js';
import { getSelectFromArray } from '../ultils/index.js';

class InventoryDiscountRepository {
  static async createInventoryDiscount({ userId, discount }) {
    return await _InventoryDiscount.create({
      userId,
      discounts: [discount],
    });
  }

  static async deleteDiscountFromInvenDiscount({ userId, discount_code }) {
    const filter = {
      userId,
      'discounts.discount_code': discount_code,
    };
    const updated = {
      $pull: {
        discounts: { discount_code },
      },
    };
    const options = {
      new: true,
      upsert: true,
    };
    return await _InventoryDiscount.findOneAndUpdate(filter, updated, options);
  }

  static async findByDiscountCode({ userId, discount_code }) {
    return await _InventoryDiscount
      .findOne({
        userId,
        'discounts.discount_code': discount_code,
      })
      .lean();
  }

  static async findByUserId({ userId }) {
    return await _InventoryDiscount.findOne({ userId }).lean();
  }

  static async saveDiscount({ userId, discount }) {
    return await _InventoryDiscount.findOneAndUpdate(
      { userId },
      { $push: { discounts: discount } },
      { new: true, upsert: true }
    );
  }
}

export default InventoryDiscountRepository;
