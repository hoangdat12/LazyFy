import { CREATED } from '../core/success.response.js';
import InventoryService from '../service/inventory.service.js';

class InventoryController {
  static async createInventoryForProduct(req, res, next) {
    try {
      const { productId, shopId } = req.body;
      return new CREATED(
        await InventoryService.createInventoryForProduct({ productId, shopId }),
        'Create success!'
      ).send(res);
    } catch (err) {
      next(err);
    }
  }
}

export default InventoryController;
