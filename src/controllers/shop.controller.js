import ShopService from "../services/shop.service.js";

class ShopController {
  static register = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const payload = req.body;
      (await ShopService.register({ userId, payload })).send(res);
    } catch (err) {
      next(err);
    }
  };
}

export default ShopController;
