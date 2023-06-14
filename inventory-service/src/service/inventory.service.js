import { BadRequestError } from '../core/error.response';
import { ClientGRPC } from '../gRPC/client.gRPC.js';
import InventoryRepository from '../pg/repository/inventory.repository';

const clientGRPC = new ClientGRPC();

class InventoryService {
  static async createInventoryForProduct({ productId, shopId }) {
    // Check product of shop valid or not
    const { product } = clientGRPC.getProduct({
      productId,
      shopId,
    });

    if (!product) throw new BadRequestError('Product is not exist!');

    return await InventoryRepository.createInventory({
      productId,
      shopId,
    });
  }

  static async increQuantityProduct({ productId, shopId, quantity }) {
    if (quantity < 0) throw new BadRequestError('Quantity must be positive!');

    const { product } = clientGRPC.getProduct({
      productId,
      shopId,
    });

    if (!product) throw new BadRequestError('Product is not exist!');

    return await InventoryRepository.increQuantityProduct({
      productId,
      shopId,
      quantity,
    });
  }

  static async increQuantityProduct({ productId, shopId, quantity }) {
    const { product } = clientGRPC.getProduct({
      productId,
      shopId,
    });

    if (!product) throw new BadRequestError('Product is not exist!');

    return await InventoryRepository.increQuantityProduct({
      productId,
      shopId,
      quantity: -quantity,
    });
  }

  static async isStock({ productId, shopId, quantity }) {
    if (quantity < 0) throw new BadRequestError('Quantity must be positive!');

    const { product } = clientGRPC.getProduct({
      productId,
      shopId,
    });

    if (!product) throw new BadRequestError('Product is not exist!');

    const invenProduct = await InventoryRepository.findByProductIdAndShopId({
      productId,
      shopId,
    });
    if (!invenProduct) throw new BadRequestError('Error!');

    return invenProduct.inven_stock > quantity;
  }
}

export default InventoryService;
