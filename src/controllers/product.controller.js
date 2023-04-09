import { OK, CREATED } from "../core/success.response.js";
import ProductFactory from "../services/product.service.js";

class ProductController {
  static createNewProduct = async (req, res, next) => {
    try {
      const type = req.body.product_type;
      const product_shop = req.user.id;
      const product = await ProductFactory.createProduct({
        type,
        payload: {
          product_shop,
          ...req.body,
        },
      });
      new CREATED("Create Product Success!", product).send(res);
    } catch (err) {
      next(err);
    }
  };

  // QUERY
  /**
   * @desc Get All Product for Shop with isDraft equal true
   * @param {Number} limit
   * @param {Number} skip
   * @param {String} product_shop
   * @returns {JSON}
   */
  static getAllDraftForShop = async (req, res, next) => {
    try {
      new OK(
        "Get list Draft success!",
        await ProductFactory.findAllDraftForShop({
          product_shop: req.user.id,
        })
      ).send(res);
    } catch (err) {
      console.log(err);
      next(err);
    }
  };

  static publishProductForShop = async (req, res, next) => {
    try {
      new OK(
        "Publish product success!",
        await ProductFactory.publishProduct({
          product_shop: req.user.id,
          productId: req.body.productId,
        })
      ).send(res);
    } catch (err) {
      console.log(err);
      next(err);
    }
  };

  static unPublishProductForShop = async (req, res, next) => {
    try {
      new OK(
        "UnPublish product success!",
        await ProductFactory.unPublishProduct({
          product_shop: req.user.id,
          productId: req.body.productId,
        })
      ).send(res);
    } catch (err) {
      console.log(err);
      next(err);
    }
  };

  // QUERY
  /**
   * @desc Get All Product for Shop with isPublished equal true
   * @param {Number} limit
   * @param {Number} skip
   * @param {String} product_shop
   * @returns {JSON}
   */
  static getAllPublishForShop = async (req, res, next) => {
    try {
      new OK(
        "Get List Publish success!",
        await ProductFactory.findAllPublishForShop({
          product_shop: req.user.id,
        })
      ).send(res);
    } catch (err) {
      console.log(err);
      next(err);
    }
  };

  static searchProductByUser = async (req, res, next) => {
    try {
      const { q } = req.query;
      const keyword = q.trim();
      new OK(
        "List product for search!",
        await ProductFactory.searchProductByUser({
          keyword,
        })
      ).send(res);
    } catch (err) {
      console.log(err);
      next(err);
    }
  };

  static findAllProductWithPagination = async (req, res, next) => {
    try {
      const { page, limit, sort } = req.query;
      const products = await ProductFactory.findAllProductWithPagination({
        limit,
        page,
        sort,
      });
      const data = {
        products,
        page,
        limit,
        sortBy: sort,
      };
      new OK("Get products success!", data).send(res);
    } catch (err) {
      console.log(err);
      next(err);
    }
  };

  static getDetailProduct = async (req, res, next) => {
    try {
      const { productId } = req.params;
      new OK(
        "Detail product",
        await ProductFactory.getDetailProduct({ productId })
      ).send(res);
    } catch (err) {
      console.log(err);
      next(err);
    }
  };

  static updateProductOfShop = async (req, res, next) => {
    const { productId, product_shop, updated } = req.body;
    new OK(
      "Updated product success!",
      await ProductFactory.updateProductOfShop({
        productId,
        product_shop,
        updated,
      })
    ).send(res);
  };
}

export default ProductController;
