import { _Product, _Clothing, _Electronic } from "../models/product.model.js";
import {
  BadRequestError,
  InternalServerError,
} from "../core/error.response.js";
import {
  findAllDraftForShop,
  findAllPublishForShop,
  publishProduct,
  unPublishProduct,
  searchProductByUser,
  findAllProductWithPagination,
  getDetailProduct,
  updateProductOfShopForModelProduct,
  updateProductOfShop,
} from "../models/repositories/product.repo.js";
import {
  UpdateNestedObjectParse,
  removeNullOrUndefinedFromRequest,
} from "../ultils/index.js";

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

  static async findAllDraftForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = {
      product_shop,
      isDraft: true,
    };
    return await findAllDraftForShop({ query, limit, skip });
  }

  static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = {
      product_shop,
      isDraft: false,
      isPublished: true,
    };
    return await findAllPublishForShop({ query, limit, skip });
  }

  static async publishProduct({ product_shop, productId }) {
    const query = {
      product_shop,
      _id: productId,
    };
    return await publishProduct({ query });
  }

  static async unPublishProduct({ product_shop, productId }) {
    const query = {
      product_shop,
      _id: productId,
    };
    return await unPublishProduct({ query });
  }

  static async searchProductByUser({ keyword, limit = 50 }) {
    const keywordRegex = new RegExp(keyword);
    return await searchProductByUser({ keyword: keywordRegex, limit });
  }

  static async findAllProductWithPagination({
    limit = 50,
    page = 1,
    sort = "ctime",
    filter = { isPublished: true, isDraft: false },
    select = [
      "product_name",
      "product_thumb",
      "product_price",
      "product_quantity",
      "product_shop",
    ],
  }) {
    return await findAllProductWithPagination({
      limit,
      page,
      sort,
      filter,
      select,
    });
  }

  static async getDetailProduct({ productId, unSelect = [] }) {
    return await getDetailProduct({ productId, unSelect });
  }

  static async updateProduct({ type, productId, payload }) {
    const productClass = this.productRegister[type];
    if (!productClass) {
      throw new BadRequestError("Type not found!");
    }
    return new productClass(payload).updateProductOfShop(productId);
  }
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

  async updateProductOfShop(productId, payload) {
    return await updateProductOfShopForModelProduct({
      productShop: payload.product_shop,
      productId,
      updated: payload,
    });
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

  async updateProductOfShop(productId) {
    // Remove attribute null or undifined
    const objectParams = removeNullOrUndefinedFromRequest(this);
    // Check Product update
    const updateProduct = await super.updateProductOfShop(
      productId,
      UpdateNestedObjectParse(objectParams)
    );
    if (objectParams.product_attributes) {
      await updateProductOfShop({
        productId,
        updated: UpdateNestedObjectParse(objectParams.product_attributes),
        model: _Clothing,
      });
    }
    return updateProduct;
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

  async updateProductOfShop(productId) {
    // Remove attribute null or undifined
    const objectParams = removeNullOrUndefinedFromRequest(this);
    // Check Product update
    const updateProduct = await super.updateProductOfShop(
      productId,
      objectParams
    );
    if (objectParams.product_attributes) {
      await updateProductOfShop({
        productShop: objectParams.product_shop,
        productId,
        updated: objectParams,
        model: _Electronic,
      });
    }
    return updateProduct;
  }
}

ProductFactory.registerProductType("Clothing", Clothing);
ProductFactory.registerProductType("Electronic", Electronic);

export default ProductFactory;
