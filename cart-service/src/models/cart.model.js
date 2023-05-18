import { model, Schema } from "mongoose";

const DOCUMENT_NAME = "Cart";
const COLLECTION_NAME = "Cart";

const cartSchema = new Schema(
  {
    cart_state: {
      type: String,
      required: true,
      enum: ["active", "completed", "pending", "failed"],
      default: "active",
    },
    cart_products: {
      type: Array,
      required: true,
      default: [],
      /*
            product: {
                productId,
                shopId,
                quantity,
            }
        */
    },
    cart_count_products: {
      type: Number,
      default: 0,
    },
    cart_user_id: {
      type: String,
      required: true,
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: {
      createdAt: "createdOn",
      updatedAt: "modifieOn",
    },
  }
);

const _Cart = model(DOCUMENT_NAME, cartSchema);
export default _Cart;
