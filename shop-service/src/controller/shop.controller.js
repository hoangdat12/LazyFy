import { CREATED } from '../core/success.response';
import ShopService from '../service/shop.service';

class ShopController {
  static async createNewShop(req, res, next) {
    try {
      const userId = req.headers.user.id;
      const { shop_name } = req.body;
      const data = await ShopService.createNewShop({
        shop_owner: userId,
        shop_name,
      });
      return new CREATED(data, 'Register shop successfully!');
    } catch (err) {
      next(err);
    }
  }
}

export default ShopController;
