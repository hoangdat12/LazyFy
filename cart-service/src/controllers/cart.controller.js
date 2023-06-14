import { InternalServerError } from '../core/error.response.js';

class CartController {
  static testController(req, res) {
    try {
      // checkProductExist(['1', '2']);
    } catch (error) {
      console.log(err);
      throw new InternalServerError('Server Error!');
    }
  }
}

export default CartController;
