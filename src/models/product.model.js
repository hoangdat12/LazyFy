import { Schema, model } from "mongoose";

const DOCUMENT_NAME = "product";
const COLLECTION_NAME = "products";

const productSchema = new Schema(
  {
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: { type: String },
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_type: { type: String, required: true },
    product_shop: { type: Schema.Types.ObjectId, ref: "user" },
    product_attributes: { type: Schema.Types.Mixed, required: true },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

const clothingSchema = new Schema(
  {
    brand: { type: String, required: true },
    size: Array,
    meterial: String,
  },
  {
    collection: "clothes",
    timestamps: true,
  }
);

const electronicSchema = new Schema(
  {
    manufactor: { type: String, required: true },
    color: Array,
    meterial: String,
  },
  {
    collection: "electronics",
    timestamps: true,
  }
);

const _Product = model(DOCUMENT_NAME, productSchema);
const _Clothing = model("clothing", clothingSchema);
const _Electronic = model("electronic", electronicSchema);

export { _Product, _Clothing, _Electronic };
