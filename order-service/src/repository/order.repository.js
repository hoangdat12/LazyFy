import _Order from '../model/order.model.js';

class OrderRepository {
  static async createOrder({
    userId,
    checkout_order,
    order_shipping,
    order_payment,
    order_products,
  }) {
    return await _Order.create({
      order_user_id: userId,
      order_checkout: checkout_order,
      order_shipping,
      order_payment,
      order_products,
    });
  }

  static async findByIdAndUserId({ orderId, userId }) {
    return await _Order
      .findOne({
        _id: orderId,
        order_user_id: userId,
      })
      .lean();
  }

  static async findAllByUserId({ userId }) {
    return await _Order.findAll({
      order_user_id: userId,
    });
  }

  static async cancelOrder({ orderId, userId }) {
    return await _Order.delete({
      _id: orderId,
      order_user_id: userId,
    });
  }
}

export default OrderRepository;
