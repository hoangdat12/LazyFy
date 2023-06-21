import {
  BadRequestError,
  ForbiddenRequestError,
  NotFoundError,
} from '../core/error.response.js';
import _Discount from '../models/discount.model.js';
import { findProductByProductIds } from '../repositories/product.repo.js';
import InventoryDiscountRepository from '../repositories/inventoryDiscount.repo.js';
import DiscountRepository from '../repositories/discount.repo.js';
import ClientGRPC from '../gRPC/client.gRPC.js';
import { applyTo } from '../constant/mongodb.constant.js';
import { RoleUserConstant } from '../constant/ultils.constant.js';
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
  static typePromotion = {
    percent: DiscountService.getPriceOfDiscountPercent,
    fixed_amount: DiscountService.getPriceOfDiscountAmount,
  };

  static async createDiscount({ payload, user }) {
    const clientGRPC = new ClientGRPC();
    const { code, start_date, end_date, shopId, applies_to, product_ids } =
      payload;

    // Check data received from client
    const date = new Date();
    const timeStartDate = new Date(start_date);
    const timeEndDate = new Date(end_date);

    if (date < timeStartDate || date > timeEndDate) {
      throw new BadRequestError('Invalid time start and end for discount!');
    }

    if (timeStartDate >= timeEndDate)
      throw new BadRequestError('Time start and end date is not Valid!');

    // Check discount is exist or not
    const foundDiscount = DiscountRepository.findDiscountByCodeAndShopId({
      code,
      shopId,
    });

    // If the discount exists and the discount is active
    if (foundDiscount && foundDiscount.discount_is_active)
      throw new BadRequestError('Discount is already exist!');

    // For Admin
    if (applies_to === applyTo.ALL) {
      if (
        user.roles !== RoleUserConstant.ADMIN ||
        user.roles !== RoleUserConstant.STAFF
      )
        throw new ForbiddenRequestError('User not permission!');
      return await DiscountService.createDiscount({ payload });
    }

    // For Shop
    if (applies_to === applyTo.SPECIFIC) {
      // Check shop with product is Exist or not
      const message = {
        type: 'getShop',
        data: shopId,
      };
      const foundShop = await clientGRPC.fetchData({ message });
      if (!foundShop) throw new BadRequestError('Shop not found!');

      const response = await findProductByProductIds({
        productIds: product_ids,
      });

      if (!response.isExist)
        throw new BadRequestError('Some product is not Exist!');

      return await DiscountService.createDiscount({ payload });
    }
  }

  static async applyDiscount({ discountCodes, userId }) {
    return await DiscountRepository.applyDiscount({ discountCodes, userId });
  }

  static async getAllDiscountCodeForProduct({
    shopId,
    productId,
    limit,
    page,
    apply,
  }) {
    const filterForAll = {
      discount_applies_to: applyTo.ALL,
    };
    const filterForSpecific = {
      discount_shopId: shopId,
      discount_applies_to: applyTo.SPECIFIC,
      discount_product_ids: productId,
    };

    return await DiscountService.getAllDiscountIsEffective({
      filterForAll,
      filterForSpecific,
      limit,
      page,
      apply,
    });
  }

  static async getAllDiscountEffective(limit, page, apply) {
    const filterForAll = {
      discount_applies_to: applyTo.ALL,
    };
    const filterForSpecific = {
      discount_applies_to: applyTo.SPECIFIC,
    };

    return await DiscountService.getAllDiscountIsEffective({
      filterForAll,
      filterForSpecific,
      limit,
      page,
      apply,
    });
  }

  static async getAllDiscountForShop({ shopId, limit, page }) {
    const discounts = await DiscountRepository.findAllDiscountCodeUnSelect({
      limit: +limit,
      page: +page,
      filter: {
        discount_shopId: shopId,
        discount_is_active: true,
      },
      unSelect: ['__v', 'discount_shopId'],
      model: _Discount,
    });

    return discounts;
  }

  // static async getDiscountAmount({ code, shopId, products }) {
  //   const foundDiscount = await DiscountRepository.findDiscountByCodeAndShopId({
  //     code,
  //     shopId,
  //   });

  //   // Check discount valid or not
  //   const response = DiscountService.discountIsValid({
  //     discount: foundDiscount,
  //   });
  //   if (!response.isValid) throw new BadRequestError(response.message);

  //   // Get total Price
  //   const totalOrder = 0;
  //   await Promise.all(
  //     products.map(async (product) => {
  //       const productDetail = await findProductById({
  //         productId: product.productId,
  //       });
  //       totalOrder += productDetail.price * product.quantity;
  //     })
  //   );

  //   // Data response
  //   const res = {
  //     isValid: false,
  //     totalPriceDiscount: 0,
  //   };
  //   // Check condition of discount
  //   if (
  //     !totalOrder > foundDiscount.discount_max_order_value &&
  //     !totalOrder < foundDiscount.discount_min_order_value
  //   ) {
  //     res.isValid = true;
  //     res.totalPriceDiscount = DiscountService.getPriceOfDiscount({
  //       typePromotion: foundDiscount.discount_type,
  //       totalPrice: totalOrder,
  //       value: foundDiscount.discount_value,
  //     });
  //   }
  //   return res;
  // }

  static async saveDiscount({ userId, discount_code }) {
    // Check discount code exist or not
    const foundDiscount = await DiscountRepository.findByDiscountCode({
      discount_code,
    });
    if (!foundDiscount) throw new NotFoundError('Discount not found!');
    else {
      // Check if the user has a voucher store
      const foundInven = await InventoryDiscountRepository.findByUserId({
        userId,
      });
      if (!foundInven) {
        return await InventoryDiscountRepository.createInventoryDiscount({
          userId,
          discount: foundDiscount,
        });
      }

      // Check inventory discount of user
      const foundDiscountInIven =
        await InventoryDiscountRepository.findByDiscountCode({
          userId,
          discount_code,
        });
      if (foundDiscountInIven)
        throw new BadRequestError('Discount is Exist in Inven of User');

      // Update
      return await InventoryDiscountRepository.saveDiscount({
        userId,
        discount: foundDiscount,
      });
    }
  }

  static async deleteDiscountFromInventory({ userId, discount_code }) {
    const foundDiscount = await DiscountRepository.findByDiscountCode({
      discount_code,
    });
    if (!foundDiscount) throw new NotFoundError('Discount not found!');
    else {
      return await InventoryDiscountRepository.deleteDiscountFromInvenDiscount({
        userId,
        discount_code,
      });
    }
  }

  static async disableDiscount({ user, shopId, discount_code }) {
    // Check discount found or not
    const foundDiscount = await DiscountRepository.findByDiscountCode({
      discount_code,
    });
    if (!foundDiscount) throw new NotFoundError('Discount code not found!');
    if (foundDiscount.discount_shopId === shopId) {
      await DiscountService.checkOnwerShop({
        userId: user.id,
        shopId,
      });
    } else {
      // Check if user's role is Amin then continue
      if (
        user.roles !== RoleUserConstant.ADMIN ||
        user.roles !== RoleUserConstant.STAFF
      )
        throw new ForbiddenRequestError('You not permission!');
    }
    // Disable discount
    foundDiscount.discount_is_active = false;
    await foundDiscount.save();
    return { message: 'Disable discount successfully!' };
  }

  static async modifyDiscountCode({
    userId,
    shopId,
    discount_code,
    updatedDiscount,
  }) {
    // Check discount found or not
    const foundDiscount = await DiscountRepository.findByDiscountCode({
      discount_code,
    });
    if (!foundDiscount) throw new NotFoundError('Discount code not found!');
    if (foundDiscount.discount_shopId !== shopId)
      throw new ForbiddenRequestError('Shop not permission!');

    await DiscountService.checkOnwerShop({
      userId,
      shopId,
    });

    return await DiscountRepository.updateDiscountCode({
      discount_code,
      updatedDiscount,
    });
  }

  static async getAllDiscountOfUser({ userId }) {
    const discounts = await InventoryDiscountRepository.findByUserId({
      userId,
    });
    return {
      quantity: discounts.length,
      discounts,
    };
  }

  // PRIVATE
  static async createDiscount({ payload }) {
    const {
      code,
      name,
      start_date,
      end_date,
      value,
      is_active = true,
      shopId,
      min_order_value,
      max_order_value,
      product_ids,
      applies_to,
      description,
      type,
      max_uses,
      max_use_per_user,
    } = payload;
    return await _Discount.create({
      discount_name: name,
      discount_discription: description,
      discount_type: type,
      discount_value: value,
      discount_code: code,
      discount_start_date: new Date(start_date),
      discount_end_date: new Date(end_date),
      discount_max_uses: max_uses,
      discount_max_uses_per_user: max_use_per_user,
      discount_min_order_value: min_order_value,
      discount_max_order_value: max_order_value,
      discount_shopId: shopId,

      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_product_ids: product_ids,
    });
  }

  static async getAllDiscountIsEffective({
    filterForAll,
    filterForSpecific,
    limit,
    page,
    apply,
  }) {
    // Filter with Discount for all product
    if (apply === applyTo.ALL) {
      return await DiscountRepository.findDiscountForProduct({
        filter: filterForAll,
        limit,
        page,
        select: [
          '_id',
          'discount_name',
          'discount_discription',
          'discount_type',
          'discount_value',
          'discount_code',
          'discount_applies_to',
        ],
      });
    }
    // Filter with Discount for specific Product
    else if (apply === applyTo.SPECIFIC) {
      return await DiscountRepository.findDiscountForProduct({
        filter: filterForSpecific,
        limit,
        page,
        select: [
          '_id',
          'discount_name',
          'discount_discription',
          'discount_type',
          'discount_value',
          'discount_code',
          'discount_applies_to',
        ],
      });
    }
    // Filter for two type of Discount
    else {
      const listDiscountOfAdmin =
        await DiscountRepository.findDiscountForProduct({
          filter: filterForAll,
          limit,
          page,
          select: [
            '_id',
            'discount_name',
            'discount_discription',
            'discount_type',
            'discount_value',
            'discount_code',
            'discount_applies_to',
          ],
        });
      const listDiscountOfShop =
        await DiscountRepository.findDiscountForProduct({
          filter: filterForSpecific,
          limit,
          page,
          select: [
            '_id',
            'discount_name',
            'discount_discription',
            'discount_type',
            'discount_value',
            'discount_code',
            'discount_applies_to',
          ],
        });
      return {
        listDiscountOfAdmin,
        listDiscountOfShop,
      };
    }
  }

  static discountIsValid({ discount }) {
    const response = {
      isValid: true,
      message: '',
    };
    if (!discount) {
      response.isValid = false;
      response.message = 'Discount not found!';
      return response;
    }

    if (!discount.discount_is_active) {
      response.isValid = false;
      response.message = 'Discount not active!';
      return response;
    }

    if (!discount.discount_max_uses) {
      response.isValid = false;
      response.message = 'The number of discount codes has expired!';
      return response;
    }

    const { discount_start_date, discount_end_date } = discount;
    const date = new Date();

    if (date < new Date(discount_start_date)) {
      response.isValid = false;
      response.message = 'The discount code is not effect yet!';
      return response;
    }

    if (date > new Date(discount_end_date)) {
      response.isValid = false;
      response.message = 'The discount code is expired!';
      return response;
    }

    if (discount.discount_max_uses - discount.discount_uses_count <= 0) {
      response.isValid = false;
      response.message =
        'Number of uses Discount has expired, please try again with another code!';
      return response;
    }

    return response;
  }

  static async checkOnwerShop({ userId, shopId }) {
    const clientGRPC = new ClientGRPC();
    const message = {
      type: 'getShop',
      data: shopId,
    };
    // Check shop exist or not
    const shopOfDiscount = await clientGRPC.fetchData({ message });
    if (!shopOfDiscount) throw new NotFoundError('Shop of Discount not found!');
    // Check if the requested user is a shop owner
    if (shopOfDiscount.shop_owner !== userId)
      throw new ForbiddenRequestError('User not permission!');
  }

  static getPriceOfDiscountPercent({ totalPrice, value }) {
    return totalPrice * value;
  }

  static getPriceOfDiscountAmount({ totalPrice, value }) {
    return totalPrice - value;
  }

  static async getPriceOfDiscount({ totalPrice, code, productId, userId }) {
    // Check discount is Exist or not
    const discount = await DiscountRepository.findByDiscountCode({
      discount_code: code,
      discount_users_used: { $ne: userId }, // Check if userId is not present in the array
    });

    const response = {
      totalDiscount: 0,
      message: 'Discount not found!',
    };
    if (!discount) return response;

    // Check discount is valid
    const res = DiscountService.discountIsValid({
      discount,
    });
    if (!res.isValid) {
      return {
        totalDiscount: 0,
        isValid: false,
        message: res.message,
      };
    } else if (discount.discount_type === 'specific') {
      let validPorductDiscount = false;
      for (let discount_product_id of discount.discount_product_ids) {
        if (discount_product_id === productId) validPorductDiscount = true;
      }
      if (!validPorductDiscount)
        return {
          totalDiscount: 0,
          message:
            'Discount not use for this product, please select others discount',
        };
    }
    return {
      totalDiscount: DiscountService.typePromotion[discount.discount_type]({
        totalPrice,
        value: discount.discount_value,
      }),
      isValid: true,
      message: res.message,
    };
  }
}

// const getPriceOfDiscountShip = ({totalPrice})

export default DiscountService;
