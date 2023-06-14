import { OK } from '../core/success.response.js';
import CheckoutService from '../service/checkout.service.js';

class CartController {
  static async checkoutReview(req, res, next) {
    try {
      const user = req.user;
      const { cartId, shop_orders } = req.body;
      return new OK(
        await CheckoutService.checkoutReview({
          cartId,
          userId: user.id,
          shop_orders,
        }),
        'Checkout'
      ).send(res);
    } catch (err) {
      next(err);
    }
  }
}

export default CartController;
