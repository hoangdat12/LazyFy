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
        'Order successfully!'
      ).send(res);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async cancelOrder(req, res, next) {
    try {
      const user = req.user;
      const { orderId } = req.body;
      return new OK(
        await OrderService.cancelOrder({
          userId: user.id,
          orderId,
        }),
        'Cancel order successfully!'
      ).send(res);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async viewOrder(req, res, next) {
    try {
      const user = req.user;
      const { orderId } = req.params.orderId;
      return new OK(
        await OrderService.viewOrder({
          userId: user.id,
          orderId,
        }),
        'Order detail'
      ).send(res);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async viewAllOrder(req, res, next) {
    try {
      const user = req.user;
      return new OK(
        await OrderService.viewAllOrder({
          userId: user.id,
        }),
        'All order of user'
      ).send(res);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}

export default CartController;
