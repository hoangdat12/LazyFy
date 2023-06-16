import { Schema, model } from 'mongoose';

const DATABASE_NAME = 'Order';
const COLLECTION_NAME = 'orders';

const orderSchema = new Schema(
  {
    order_user_id: {
      type: Number,
      required: true,
    },
    order_checkout: {
      type: Object,
      default: {},
    },
    /*
    order_checkout: {
        totalPrice,
        totalApplyDiscount,
        feeShip
    }
    */
    order_shipping: {
      type: Object,
      default: {},
    },
    /*
    order_shipping: {
        street,
        city,
        state,
        country
    }
   */
    order_payment: {
      type: Object,
      default: {},
    },
    order_products: {
      type: Array,
      required: true,
    },
    order_status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'cancelled', 'delivered'],
      default: 'pending',
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

const _Order = model(DATABASE_NAME, orderSchema);
export default _Order;
