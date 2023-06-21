import _Cart from '../models/cart.model.js';

class CartRepository {
  static async createCartOfUser({ userId }) {
    return await _Cart.create({ cart_user_id: userId });
  }

  static async findByUserId({ userId }) {
    return await _Cart.findOne({ cart_user_id: userId }).lean();
  }

  static async findById({ cartId }) {
    return await _Cart.findOne({ _id: cartId }).lean();
  }

  static async findProductExist({ userId, productId }) {
    return await _Cart.findOne({
      cart_user_id: userId,
      'cart_products.productId': productId,
    });
  }

  static async updateQuantityOfProductInCart({ userId, productId, quantity }) {
    const query = {
      cart_user_id: userId,
      'cart_products.productId': productId,
      cart_state: 'active',
    };
    const updateSet = {
      $inc: {
        'cart_products.$.quantity': quantity,
      },
    };
    const options = { new: true, upsert: true };

    return await _Cart.findOneAndUpdate(query, updateSet, options);
  }

  static async deleteProductFromCart({ userId, productId }) {
    const query = {
      cart_user_id: userId,
      'cart_products.productId': productId,
      cart_state: 'active',
    };
    const updateSet = {
      $pull: {
        cart_products: { productId },
      },
      $inc: {
        cart_count_products: -1,
      },
    };
    const options = { new: true, upsert: true };
    return await _Cart.findOneAndUpdate(query, updateSet, options);
  }

  // static async deleteMultiProductFromCart({ userId, productIds }) {
  //   const query = {
  //     cart_user_id: userId,
  //     cart_state: 'active',
  //   };
  //   const updateSet = {
  //     $pull: {
  //       cart_products: { productId: { $in: productIds } },
  //     },
  //   };
  //   const options = { new: true, upsert: true };

  //   return await _Cart.updateMany(query, updateSet, options);
  // }

  static async addProductToCart({ userId, product }) {
    const query = {
      cart_user_id: userId,
      cart_state: 'active',
    };
    const updateSet = {
      $push: {
        cart_products: product,
      },
      $inc: {
        cart_count_products: 1,
      },
    };
    const options = { new: true, upsert: true };
    return await _Cart.findOneAndUpdate(query, updateSet, options);
  }
}

export default CartRepository;
