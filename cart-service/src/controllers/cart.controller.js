import { InternalServerError } from '../core/error.response';
import { checkProductExist } from '../gRPC/client.gRPC';

class CartController {
  static testController(req, res) {
    try {
      checkProductExist(['1', '2']);
    } catch (error) {
      console.log(err);
      throw new InternalServerError('Server Error!');
    }
  }
}

export default CartController;
