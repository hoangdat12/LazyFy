import { Schema, model } from "mongoose";
import slugify from "slugify";

const DOCUMENT_NAME = "product";
const COLLECTION_NAME = "products";

const productSchema = new Schema(
  {
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_slug: String,
    product_description: { type: String },
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_type: { type: String, required: true },
    product_shop: { type: Schema.Types.ObjectId, ref: "shop" },
    product_attributes: { type: Schema.Types.Mixed, required: true },
    product_ratingAverage: {
      type: "Number",
      default: 4.5,
      min: [1, "Rating must be greater 1.0"],
      max: [5, "Rating must be lesser 5.0"],
    },
    product_variation: { type: Array, default: [] },
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false },
    product_images: { type: Array },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

// Create index for search with name and description
productSchema.index({ product_name: "text", product_description: "text" });

// Document middleware: runs before .save() and .create() ,...
productSchema.pre("save", function (next) {
  this.product_slug = slugify(this.product_name, { lower: true });
  next();
});

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
