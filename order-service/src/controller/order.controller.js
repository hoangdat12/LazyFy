import { OK } from '../core/success.response.js';
import CheckoutService from '../service/checkout.service.js';
import OrderService from '../service/order.service.js';

class CartController {
  static async checkoutReview(req, res, next) {
    try {
      const user = req.user;
      const { cartId, shop_orders, discountApply } = req.body;
      return new OK(
        await CheckoutService.checkoutReview({
          cartId,
          userId: user.id,
          shop_orders,
          discountApply,
        }),
        'Checkout'
      ).send(res);
    } catch (err) {
      next(err);
    }
  }

  static async order(req, res, next) {
    try {
      const user = req.user;
      const { cartId, shop_orders, discountApply } = req.body;
      return new OK(
        await OrderService.order({
          cartId,
          userId: user.id,
          shop_orders,
          discountApply,
        }),
        'Checkout'
      ).send(res);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}

export default CartController;
