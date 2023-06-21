import {
  BadRequestError,
  ForbiddenRequestError,
  NotFoundError,
} from '../core/error.response.js';
import {
  ClientCartGRPC,
  ClientProductGRPC,
  ClientInventoryGRPC,
} from '../gRPC/client.grpc.js';

const clientCartGRPC = new ClientCartGRPC();
const clientProductGRPC = new ClientProductGRPC();
const clientInventoryGRPC = new ClientInventoryGRPC();

/*
  shop_orders: [
    {
      shopId,
      products: [
        {
          productId,
          quantity,
          discount
        }
      ],
    }
  ]
*/

class CheckoutService {
  static async checkoutReview({ cartId, userId, shop_orders, discountApply }) {
    const foundCart = await clientCartGRPC.checkCartExist({ cartId });
    if (!foundCart.userId) throw new NotFoundError('Cart not found!');
    if (foundCart.userId !== userId.toString())
      throw new ForbiddenRequestError('User not permission with cart!');

    let checkout_order = {
        totalPrice: 0,
        feeShip: 0,
        totalDiscount: 0,
        totalCheckout: 0, // Sum all
      },
      shop_orders_new = [],
      discountCodes = [];

    // Check product
    for (let shop_order of shop_orders) {
      let totalPriceOfShop = 0;
      for (let prd of shop_order.products) {
        const { product } = await clientProductGRPC.getProduct({
          productId: prd.productId,
          shopId: shop_order.shopId,
        });
        if (!product)
          throw new BadRequestError(
            'Some products do not exist, please try again!'
          );
        // Check inventory
        const { isStock } = await clientInventoryGRPC.checkProductIsStock({
          productId: prd.productId,
          shopId: shop_order.shopId,
          quantity: prd.quantity,
        });
        if (!isStock) throw new BadRequestError('Product sell out!');

        // Total Price
        totalPriceOfShop += product.product_price * prd.quantity;
        // New Order
        const shop_order_new = {
          productId: product._id,
          shopId: product.product_shop,
          quantity: prd.quantity,
        };
        shop_orders_new.push(shop_order_new);

        // Discount of Shop
        if (prd.discount) {
          const res = await clientProductGRPC.getDiscountPrice({
            totalPrice: totalPriceOfShop,
            discountCode: prd.discount,
            productId: product._id,
            userId,
          });
          if (!res.isValid) {
            throw new BadRequestError(res.message);
          }

          checkout_order.totalDiscount += res.discountPrice;
          discountCodes.push(prd.discount);
        }
      }

      checkout_order.totalPrice += totalPriceOfShop;
    }
    let discountPrice = 0;
    // Discount for all
    if (discountApply) {
      const res = await clientProductGRPC.getDiscountPrice({
        totalPrice: checkout_order.totalPrice,
        discountCode: discountApply,
        productId: null,
        userId,
      });
      if (!res.isValid) {
        throw new BadRequestError(res.message);
      }
      discountPrice = res.totalDiscount;
    }

    checkout_order.totalDiscount += discountPrice;

    checkout_order.totalCheckout =
      checkout_order.totalPrice - checkout_order.totalDiscount;

    return {
      checkout_order,
      shop_orders_new,
      shop_orders,
      discountCodes: [...discountCodes, discountApply],
    };
  }
}

export default CheckoutService;
