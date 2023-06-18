import {
  BadRequestError,
  ConflictRequestError,
  InternalServerError,
  NotFoundError,
} from '../core/error.response.js';
import ClientGRPC from '../gRPC/client.gRPC.js';
import CartRepository from '../repository/cart.repository.js';
/**
 * addToSet do not add new Item to array if item is exist in array
 * push then not care that
 */

const clientGRPCForProduct = new ClientGRPC('product_queue');

class CartService {
  static async createCartForNewUser({ userId }) {
    const cartExist = await CartRepository.findByUserId({ userId });
    if (cartExist) throw new ConflictRequestError(`User's cart is ready eixst`);
    return await CartRepository.createCartOfUser({ userId });
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
    const productId = product.productId;
    const cartUserExist = await CartRepository.findOne({
      cart_user_id: userId,
      'cart_products.productId': productId,
    });
    if (!cartUserExist) {
      // Check product is exist or not
      let productIds = [productId];
      let cartUpdated = null;
      const message = {
        type: 'check',
        data: productIds,
      };
      const res = await clientGRPCForProduct.fetchData({ message });
      if (!res.isExist) {
        const response = {
          msg: 'Some product is not Exist!',
          productIsNotExist: res.productIsNotExist,
        };
        return new BadRequestError(response);
      }
      // Add product to Cart
      cartUpdated = await CartRepository.addProductToCart({
        userId,
        product: {
          productId,
          shopId: product.shopId,
          quantity: product.quantity,
        },
      });
      if (!cartUpdated) throw new InternalServerError('DB error!');
      else return cartUpdated;
    }

    if (cartUserExist) {
      cartUpdated = await CartRepository.updateQuantityOfProductInCart({
        userId,
        product,
      });
      if (!cartUpdated) throw new InternalServerError('DB error');
      return cartUpdated;
    }
  }

  static async deleteProductFromCart({ userId, productId }) {
    const productExistInCart = await CartRepository.findProductExist({
      userId,
      productId,
    });
    if (!productExistInCart) return {};
    const cartUpdated = await CartRepository.deleteProductFromCart({
      userId,
      productId,
    });
    return cartUpdated;
  }

  static async deleteMultiProductFromCart({ userId, productIds }) {
    const cartUserExist = await CartRepository.findByUserId({ userId });
    if (!cartUserExist) throw new NotFoundError('User not found!');
    const cartUpdated = await CartRepository.deleteMultiProductFromCart({
      userId,
      productIds,
    });
    if (!cartUpdated) throw new NotFoundError('Product not found in Cart!');
    else return cartUpdated;
  }

  // update cart
  /**
    item_products: [
      {
        productId,
        shopId,
        price,
        quantity,
        older_quantity
      }
    ]

   */
  static async updateQuantity({ userId, item_products }) {
    // Check product is exist or not
    let productIds = [];
    item_products.map((item) => {
      productIds.push(item?.productId);
    });
    const message = {
      type: 'check',
      data: productIds,
    };
    const res = await clientGRPCForProduct.fetchData({ message });
    if (!res.isExist) {
      const response = {
        msg: 'Some product is not Exist!',
        productIsNotExist: res.productIsNotExist,
      };
      return new BadRequestError(response);
    }
    // Update quantity of product
    let productUpdated = [];
    await Promise.all(
      item_products.map(async (item) => {
        const itemUpdated = await CartRepository.updateQuantityOfProductInCart({
          userId,
          product: item,
        });
        // If quantity after update equal 0 then delete from cart
        if (item.older_quantity - item.quantity === 0) {
          await CartRepository.deleteProductFromCart({
            userId,
            productId: itemUpdated._id,
          });
        }
        productUpdated.push(itemUpdated);
      })
    );
    return productUpdated;
  }

  static async getCart({ userId }) {
    const cartUserExist = await CartRepository.findByUserId({ userId });
    if (!cartUserExist) throw new NotFoundError('User not found!');
    else return cartUserExist;
  }
}

export default CartService;
