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
}

export default ProductController;
