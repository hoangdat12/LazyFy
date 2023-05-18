import ShopService from '../services/shop.service.js';

class ShopController {
  static register = async (req, res, next) => {
    try {
      const user = req.headers('user');
      const payload = req.body;
      (await ShopService.register({ userId: user.id, payload })).send(res);
    } catch (err) {
      next(err);
    }
  };
}

export default ShopController;
