import { _Product, _Clothing, _Electronic } from "../models/product.model.js";
import {
  BadRequestError,
  InternalServerError,
} from "../core/error.response.js";

// A factory class to create different types of products
class ProductFactory {
  static productRegister = {};

  static registerProductType(productType, classRef) {
    this.productRegister[productType] = classRef;
  }

  static async createProduct({ type, payload }) {
    const productClass = this.productRegister[type];
    if (!productClass) {
      throw new BadRequestError("Type not found!");
    }
    return new productClass(payload).createProduct();
  }

  // static async createProduct({ type, payload }) {
  //   // Checking the type of product and creating a new instance of the appropriate class
  //   switch (type) {
  //     case "Electronic":
  //       return new Electronic(payload).createProduct();
  //     case "Clothing":
  //       return new Clothing(payload).createProduct();
  //     default:
  //       throw new BadRequestError("Type not found!");
  //   }
  // }
}

// A base class for all products
class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    // Initializing the properties of the product
    (this.product_name = product_name),
      (this.product_thumb = product_thumb),
      (this.product_description = product_description),
      (this.product_price = product_price),
      (this.product_quantity = product_quantity),
      (this.product_type = product_type),
      (this.product_shop = product_shop);
    this.product_attributes = product_attributes;
  }

  // Method to create a new product in the database
  async createProduct(productId) {
    return await _Product.create({ _id: productId, ...this });
  }
}

// CLOTHING
class Clothing extends Product {
  async createProduct() {
    // Creating the clothing product
    const clothing = await _Clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!clothing) {
      throw new InternalServerError("Create product Error!");
    }
    // Creating a new product instance using the base class's createProduct method
    const newProduct = super.createProduct(clothing._id);
    if (!newProduct) {
      throw new InternalServerError("Create product Error!");
    } else {
      return newProduct;
    }
  }
}

// ELECTRONIC
class Electronic extends Product {
  async createProduct() {
    // Creating the electronic product
    const electronic = await _Electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!electronic) {
      throw new InternalServerError("Create product Error!");
    }
    // Creating a new product instance using the base class's createProduct method
    const newProduct = super.createProduct(electronic._id);
    if (!newProduct) {
      throw new InternalServerError("Create product Error!");
    } else {
      return newProduct;
    }
  }
}

ProductFactory.registerProductType("Clothing", Clothing);
ProductFactory.registerProductType("Electronic", Electronic);

export default ProductFactory;
