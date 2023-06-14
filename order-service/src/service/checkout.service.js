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
        "1",
        "2"
      ],
      discountOfShop
    }
  ]
*/

class CheckoutService {
  static async checkoutReview({ cartId, userId, shop_orders }) {
    const foundCart = await clientCartGRPC.checkCartExist({ cartId });
    if (!foundCart) throw new NotFoundError('Cart not found!');
    if (foundCart.userId !== userId)
      throw new ForbiddenRequestError('User not permission with cart!');

    const checkout_order = {
      totalPrice: 0,
      feeShip: 0,
      totalDiscount: 0,
      totalCheckout: 0, // Sum all
    };

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
        const isStock = await clientInventoryGRPC.checkProductIsExist({
          productId: prd.productId,
          shopId: shop_order.shopId,
          quantity: prd.quantity,
        });
        if (!isStock) throw new BadRequestError('Product sell out!');

        // Total Price
        totalPriceOfShop += product.product_price * prd.quantity;
      }
      const discountPrice = await clientProductGRPC.getDiscountPrice({
        totalPrice: totalPriceOfShop,
      });
      checkout_order.totalDiscount += discountPrice;
      checkout_order.totalPrice += totalPriceOfShop;
    }

    checkout_order.totalCheckout =
      checkout_order.totalDiscount + checkout_order.totalPrice;

    return checkout_order;
  }
}

export default CheckoutService;
