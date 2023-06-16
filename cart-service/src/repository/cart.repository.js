import _Cart from '../models/cart.model.js';

class CartRepository {
  static async createCartOfUser({ userId }) {
    console.log(userId);
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
      userId,
      'cart_products.productId': productId,
    });
  }

  static async updateQuantityOfProductInCart({ userId, product }) {
    const { productId, quantity } = product;
    const query = {
      cart_user_id: userId,
      'cart_products.productId': productId,
      state: 'active',
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
      state: 'active',
    };
    const updateSet = {
      $pullAll: {
        'cart_products.productId': productId,
      },
    };
    const options = { new: true, upsert: true };
    return await _Cart.findOneAndUpdate(query, updateSet, options);
  }

  static async deleteMultiProductFromCart({ userId, productIds }) {
    const query = {
      cart_user_id: userId,
      'cart_products.productId': { $in: productIds },
      state: 'active',
    };
    const updateSet = {
      $pullAll: {
        'cart_products.productId': { $in: productIds },
      },
    };
    const options = { new: true, upsert: true };

    return await _Cart.updateMany(query, updateSet, options);
  }

  static async addProductToCart({ userId, product }) {
    const query = {
      cart_user_id: userId,
      state: 'active',
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

  static async deleteProductFromCart({ userId, productId }) {
    const query = {
      cart_user_id: userId,
      state: 'active',
      'product.cart_products.productId': productId,
    };
    const updated = {
      $pullAll: {
        'product.cart_products.productId': productId,
      },
    };
    const options = { new: true, upsert: true };
    return await _Cart.findOneAndUpdate(query, updated, options);
  }
}

export default CartRepository;
