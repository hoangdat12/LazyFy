import { OK, CREATED } from '../core/success.response.js';
import ProductFactory from '../services/product.service.js';

class ProductController {
  static createNewProduct = async (req, res, next) => {
    try {
      const user = req.headers.user;
      const type = req.body.product_type;

      const product_shop = user.id;
      const product = await ProductFactory.createProduct({
        type,
        payload: {
          product_shop,
          ...req.body,
        },
      });
      new CREATED(product, 'Create Product Success!').send(res);
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
        await ProductFactory.findAllDraftForShop({
          product_shop: req.user.id,
        }),
        'Get list Draft success!'
      ).send(res);
    } catch (err) {
      console.log(err);
      next(err);
    }
  };

  static publishProductForShop = async (req, res, next) => {
    try {
      new OK(
        await ProductFactory.publishProduct({
          product_shop: req.user.id,
          productId: req.body.productId,
        }),
        'Publish product success!'
      ).send(res);
    } catch (err) {
      console.log(err);
      next(err);
    }
  };

  static unPublishProductForShop = async (req, res, next) => {
    try {
      new OK(
        await ProductFactory.unPublishProduct({
          product_shop: req.user.id,
          productId: req.body.productId,
        }),
        'UnPublish product success!'
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
        await ProductFactory.findAllPublishForShop({
          product_shop: req.user.id,
        }),
        'Get List Publish success!'
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
        await ProductFactory.searchProductByUser({
          keyword,
        }),
        'List product for search!'
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
      new OK(data, 'Get products success!').send(res);
    } catch (err) {
      console.log(err);
      next(err);
    }
  };

  static getDetailProduct = async (req, res, next) => {
    try {
      const { productId } = req.params;
      new OK(
        await ProductFactory.getDetailProduct({ productId }),
        'Detail product'
      ).send(res);
    } catch (err) {
      console.log(err);
      next(err);
    }
  };

  static updateProductOfShop = async (req, res, next) => {
    try {
      new OK(
        await ProductFactory.updateProduct({
          type: req.body.product_type,
          productId: req.params.productId,
          payload: {
            product_shop: req.user.id,
            ...req.body,
          },
        }),
        'Updated product success!'
      ).send(res);
    } catch (err) {
      console.log(err);
      next(err);
    }
  };
}

export default ProductController;
