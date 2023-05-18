import { BadRequestError, NotFoundError } from "../core/error.response.js";
import {
  findDiscountByCodeAndShopId,
  findAllDiscountCodeUnSelect,
} from "../models/repositories/discount.repo.js";
import { findAllProductWithPagination } from "../models/repositories/product.repo.js";
import _Discount from "../models/discount.model.js";
/**
 * Discount Service
 * 1. Generator discount code [Admin | Shop]
 * 2. Get discount code
 * 3. Get all discount code
 * 4. Verify discount code
 * 5. Delete discount code [Admin | Shop]
 * 6. Cancel discount
 */
class DiscountService {
  static async createDiscount(payload) {
    const {
      code,
      name,
      start_date,
      end_date,
      value,
      is_active,
      shopId,
      min_order_value,
      max_order_value,
      product_ids,
      applies_to,
      description,
      type,
      max_uses,
      uses_count,
      max_use_per_user,
    } = payload;

    const date = new Date();
    const timeStartDate = new Date(start_date);
    const timeEndDate = new Date(end_date);

    if (date < timeStartDate || date > timeEndDate) {
      throw new BadRequestError("Invalid time start and end for discount!");
    }

    if (timeStartDate >= timeEndDate)
      throw new BadRequestError("Time start and end date is not Valid!");

    const foundDiscount = findDiscountByCodeAndShopId({ code, shopId });

    if (foundDiscount && foundDiscount.discount_is_active)
      throw new BadRequestError("Discount is already exist!");

    const newDiscount = await _Discount.create({
      discount_name: name,
      discount_discription: description,
      discount_type: type,
      discount_value: value,
      discount_code: code,
      discount_start_date: timeStartDate,
      discount_end_date: timeEndDate,
      discount_max_uses: max_uses,
      discount_uses_count: uses_count,
      discount_max_uses_per_user: max_use_per_user,
      discount_min_order_value: min_order_value,
      discount_max_order_value: max_order_value,
      discount_shopId: shopId,

      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_product_ids: product_ids,
    });

    return newDiscount;
  }

  static async getAllDiscountCodeWithProduct({
    code,
    shopId,
    userId,
    limit,
    page,
  }) {
    const foundDiscount = findDiscountByCodeAndShopId({ code, shopId });
    if (!foundDiscount || !foundDiscount.is_active)
      throw new NotFoundError("Discount is not exist!");

    const { discount_applies_to, discount_product_ids } = foundDiscount;

    if (discount_applies_to === "all") {
      const products = await findAllProductWithPagination({
        limit,
        page,
        sort: "ctime",
        filter: {
          product_shop: shopId,
          isPublished: true,
        },
        select: [product_name],
      });

      return products;
    }

    if (discount_applies_to === "specific") {
    }
  }

  static async getAllDiscountByShop({ limit, page, shopId }) {
    const discounts = await findAllDiscountCodeUnSelect({
      limit: +limit,
      page: +page,
      filter: {
        discount_shopId: shopId,
        discount_is_active: true,
      },
      unSelect: ["__v", "discount_shopId"],
      model: _Discount,
    });

    return discounts;
  }

  static async getDiscountAmount({ code, userId, shopId, products }) {
    const foundDiscount = await findDiscountByCodeAndShopId({ code, shopId });
    if (
      !foundDiscount ||
      !foundDiscount.is_active ||
      !foundDiscount.discount_max_uses
    )
      throw new NotFoundError("Discount invalid!");

    const { discount_start_date, discount_end_date } = foundDiscount;
    const date = new Date();

    if (date < new Date(discount_start_date) || new Date(discount_end_date)) {
      throw new BadRequestError("Invalid time start and end for discount!");
    }

    const totalOrder = 0;
  }
}

export default DiscountService;
