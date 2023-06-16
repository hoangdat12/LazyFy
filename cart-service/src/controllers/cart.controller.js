import { InternalServerError } from '../core/error.response.js';
import { OK } from '../core/success.response.js';
import CartService from '../services/cart.service.js';

class CartController {
  static testController(req, res) {
    try {
      // checkProductExist(['1', '2']);
    } catch (error) {
      console.log(err);
      throw new InternalServerError('Server Error!');
    }
  }

  static async createCartForUser(req, res, next) {
    try {
      const user = req.user;
      return new OK(
        await CartService.createCartForNewUser({ userId: user.id }),
        'Create cart success!'
      ).send(res);
    } catch (err) {
      next(err);
    }
  }
}

export default CartController;
