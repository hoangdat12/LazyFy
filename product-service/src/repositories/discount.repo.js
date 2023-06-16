import _Discount from '../models/discount.model.js';
import { getSelectFromArray, getUnSelectFromArray } from '../ultils/index.js';

class DiscountRepository {
  static async findDiscountByCodeAndShopId({ code, shopId }) {
    return await _Discount
      .findOne({
        discount_code: code,
        discount_shopId: shopId,
        discount_is_active: true,
      })
      .lean();
  }

  static async applyDiscount({ discountCodes, userId }) {
    const query = {
      discount_code: { $in: discountCodes }, // Use $in operator to match multiple discount codes
    };
    const update = {
      $push: { discount_users_used: userId },
      $inc: { discount_uses_count: 1 },
    };
    const options = { new: true, upsert: true };

    await _Discount.updateMany(query, update, options);
  }

  static async findAllDiscountCodeUnSelect({
    limit = 50,
    page = 1,
    sort = 'ctime',
    filter,
    unSelect,
    model,
  }) {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
    const products = await model
      .find({ ...filter, discount_is_active: true })
      .skip(skip)
      .limit(limit)
      .select(getUnSelectFromArray(unSelect))
      .sort(sortBy)
      .lean();

    return products;
  }

  static async checkDiscountExists(model, filter) {
    return await model.findOne({ ...filter, discount_is_active: true }).lean();
  }

  static async findByDiscountCode({ discount_code }) {
    return await _Discount.findOne({ discount_code, discount_is_active: true });
  }

  static async findByDiscountId({ discount_id }) {
    return await _Discount.findOne({
      _id: discount_id,
      discount_is_active: true,
    });
  }

  static async updateDiscountCode({ discount_code, updatedDiscount }) {
    return await _Discount.findOneAndUpdate(
      { discount_code },
      { ...updatedDiscount },
      { new: true, upsert: true }
    );
  }

  static async findDiscountForProduct({ filter, limit, page, select }) {
    const currentDate = new Date();
    console.log(filter);
    return await _Discount
      .find({
        ...filter,
        discount_is_active: true,
        discount_start_date: { $lte: currentDate }, // Start date less than or equal to the current date
        discount_end_date: { $gte: currentDate }, // End date greater than or equal to the current date
      })
      .skip((page - 1) * limit)
      .select(getSelectFromArray(select))
      .limit(limit)
      .lean()
      .exec();
  }

  static async findDiscountForProductShopId({ shopId, apply, limit, page }) {
    const currentDate = new Date();
    return await _Discount
      .find({
        discount_shopId: shopId,
        discount_is_active: true,
        $in: {
          discount_product_ids: productId,
        },
        discount_start_date: { $lte: currentDate }, // Start date less than or equal to the current date
        discount_end_date: { $gte: currentDate }, // End date greater than or equal to the current date
      })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()
      .exec();
  }
}
export default DiscountRepository;
