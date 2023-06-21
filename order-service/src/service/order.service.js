import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from '../core/error.response.js';
import CheckoutService from './checkout.service.js';
import { acquireLock, releaseLock } from './redis.service.js';
import Producer from '../rabbitMQ/producer.js';
import OrderRepository from '../repository/order.repository.js';
import { Types } from 'mongoose';

/*
  Producer of RabbitMQ
*/
const producerForCart = new Producer('cart_queue');
const producerForProduct = new Producer('product_queue');
const producerForInventory = new Producer('inventory_queue');

class OrderService {
  static async order({
    userId,
    cartId,
    shop_orders,
    discountApply,
    user_adress = {},
    user_payment = {},
  }) {
    const { checkout_order, shop_orders_new, discountCodes } =
      await CheckoutService.checkoutReview({
        cartId,
        userId,
        shop_orders,
        discountApply,
      });
    // Check product is valid or not
    let validAcquireProduct = [];
    let productIds = [];

    for (let product of shop_orders_new) {
      const { productId, quantity } = product;
      productIds.push(productId);
      const keyLock = await acquireLock({
        productId,
        quantity,
        shopId: product.shopId,
      });
      validAcquireProduct.push(keyLock ? true : false);
      if (keyLock) await releaseLock({ key: keyLock });
    }
    if (validAcquireProduct.includes(false)) {
      throw new BadRequestError(
        'Some products were updated, please back to your cart!'
      );
    }

    // Create new Order
    const newOrder = await OrderRepository.createOrder({
      userId,
      checkout_order,
      order_shipping: user_adress,
      order_payment: user_payment,
      order_products: shop_orders_new,
    });

    if (newOrder) {
      // delete product from cart
      const msg = {
        type: 'delete',
        data: {
          userId,
          productIds,
        },
      };
      producerForCart.sendMessage(msg);

      // Add user in discount used
      producerForProduct.sendMessage({
        type: 'applyDiscount',
        data: {
          discountCodes,
          userId,
        },
      });

      // Decrement quantity
      producerForInventory.sendMessage({
        type: 'decreQuantity',
        data: {
          shop_orders,
        },
      });

      return newOrder;
    } else throw new InternalServerError('DB error!');
  }

  static async cancelOrder({ orderId, userId }) {
    if (!Types.ObjectId.isValid(orderId))
      throw new NotFoundError('Order not found');

    const order = await OrderRepository.findByIdAndUserId({ orderId, userId });
    if (!order) throw new NotFoundError('Order not found');

    if (order.order_status !== 'pending')
      throw new BadRequestError('Not allowed cancel order!');

    // Increment quantity of Product
    producerForInventory.sendMessage({
      type: 'increQuantity',
      data: order.order_products,
    });

    await OrderRepository.cancelOrder({ orderId, userId });
  }

  static async viewOrder({ userId, orderId }) {
    if (!Types.ObjectId.isValid(orderId))
      throw new NotFoundError('Order not found');
    return await OrderRepository.findByIdAndUserId({ orderId, userId });
  }

  static async viewAllOrder({ userId }) {
    return await OrderRepository.findAllByUserId({ userId });
  }
}

export default OrderService;
