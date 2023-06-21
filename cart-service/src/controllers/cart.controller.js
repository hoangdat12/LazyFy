import { OK } from '../core/success.response.js';
import CartService from '../services/cart.service.js';

class CartController {
  static async createCartForUser(req, res, next) {
    try {
      const user = req.user;
      return new OK(
        await CartService.createCartForNewUser({ userId: user.id }),
        'Create cart success!'
      ).send(res);
    } catch (err) {
      next(err);
    }
  }

  static async addProductToCart(req, res, next) {
    try {
      const user = req.user;
      const { productId, quantity } = req.body;
      return new OK(
        await CartService.addProductToCart({
          userId: user.id.toString(),
          productId,
          quantity,
        }),
        'Add cart success!'
      ).send(res);
    } catch (err) {
      next(err);
    }
  }

  static async deleteProductFromCart(req, res, next) {
    try {
      const user = req.user;
      const productId = req.params.productId;
      return new OK(
        await CartService.deleteProductFromCart({ userId: user.id, productId }),
        'Delete product from cart success!'
      ).send(res);
    } catch (err) {
      next(err);
    }
  }

  static async deleteMultiProductFromCart(req, res, next) {
    try {
      const user = req.user;
      const { productIds } = req.body;
      return new OK(
        await CartService.deleteMultiProduct({
          userId: user.id,
          productIds,
        }),
        'Delete product from cart success!'
      ).send(res);
    } catch (err) {
      next(err);
    }
  }

  static async updateQuantity(req, res, next) {
    try {
      const user = req.user;
      const { item_product } = req.body;
      return new OK(
        await CartService.updateQuantity({ userId: user.id, item_product }),
        'Update cart success!'
      ).send(res);
    } catch (err) {
      next(err);
    }
  }

  static async getCart(req, res, next) {
    try {
      const user = req.user;
      return new OK(
        await CartService.getCart({ userId: user.id }),
        'Success!'
      ).send(res);
    } catch (err) {
      next(err);
    }
  }
}

export default CartController;
