import { InternalServerError } from "../core/error.response.js";
import _Cart from "../models/cart.model.js";

/**
 * addToSet do not add new Item to array if item is exist in array
 * push then not care that
 */

class CartService {
  async createCartOfUser({ userId, product }) {
    const query = { cart_user_id: userId, cart_state: "active" };
    const updateOrInsert = {
      $addToSet: {
        cart_products: product,
      },
    };
    const options = { new: true, upsert: true };

    return await _Cart.findOneAndUpdate(query, updateOrInsert, options);
  }

  async updateQuantityOfProductInCart({ userId, product }) {
    const { productId, quantity } = product;
    const query = {
      cart_user_id: userId,
      "cart_products.productId": productId,
      state: "active",
    };
    const updateSet = {
      $inc: {
        "cart_products.$.quantity": quantity,
      },
    };
    const options = { new: true, upsert: true };

    return await _Cart.findOneAndUpdate(query, updateSet, options);
  }

  /**
   * 1. Add Product To Cart
   *    - Case 1: Cart exist or not
   *    - Case 2: There are product in cart?
   *    - Case 3: Product is exist in cart
   * 2. Product received from Client
   *   {
   *    productId,
   *    olderQuantity,
   *    quantity,
   *    shopId,
   *    name,
   *    price
   *    }
   */

  static async addProductToCart({ userId, product }) {
    // Check product is exist or not

    //
    const cartUserExist = await _Cart.findOne({
      cart_user_id: userId,
    });

    if (!cartUserExist) {
      return await this.createCartOfUser({ userId, product });
    }

    if (!cartUserExist.cart_products.length) {
      cartUserExist.cart_count_products = [product];
      return await cartUserExist.save();
    }

    return await this.updateQuantityOfProductInCart({ userId, product });
  }

  // update cart
  /**
    shop_order_ids: [
      shopId, 
      item_products: [
        {
          productId,
          shopId,
          price,
          quantity,
          old_quantity
        }
      ]
    ]

   */
  static async addProductToCartV2({ userId, product }) {
    // Check product is exist or not

    //
    const { productId, quantity, old_quantity } =
      shop_order_ids[0]?.item_products[0];

    // Check product Exist

    if (quantity === 0) {
      // delete product from cart
    }

    return await CartService.updateQuantityOfProductInCart({
      userId,
      product: { productId, quantity: quantity - old_quantity },
    });
  }
}

export default CartService;
