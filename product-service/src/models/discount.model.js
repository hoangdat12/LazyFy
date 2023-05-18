import { model, Schema } from "mongoose";

const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "discounts";

const discountSchema = new Schema({
  discount_name: { type: String, required: true }, // Name of discount
  discount_discription: { type: String, required: true },
  discount_type: { type: String, default: "fixed_amount" },
  discount_value: { type: Number, required: true }, // How much discount
  discount_code: { type: String, required: true }, //Code (PAKSDALS)
  discount_start_date: { type: Date, required: true },
  discount_end_date: { type: Date, required: true },
  discount_max_uses: { type: Date, required: true }, // Quantity discount applied
  discount_uses_count: { type: Number, required: true }, // Quantity of discount is used
  discount_users_count: { type: Array, default: [] }, // User is used discount
  discount_max_uses_per_user: { type: Number, required: true }, // Quantity discount max used for each user
  discount_min_order_value: { type: Number, required: true }, // Minimun order price to use discount
  discount_max_order_value: { type: Number, default: null },
  discount_shopId: { type: Schema.Types.ObjectId, ref: "shop" },

  discount_is_active: { type: Boolean, default: true },
  discount_applies_to: {
    type: String,
    default: "all",
    enum: ["all", "specific"],
  }, // Discount is applied for
  discount_product_ids: { type: Array, default: [] }, // List product is used discount
});

export default _Discount = model(DOCUMENT_NAME, discountSchema);
