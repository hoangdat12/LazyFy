import {
  BadRequestError,
  ConflictRequestError,
} from '../core/error.response.js';
import { ClientGRPC } from '../gRPC/client.gRPC.js';
import InventoryRepository from '../pg/repository/inventory.repository.js';

const clientGRPC = new ClientGRPC();

class InventoryService {
  static async createInventoryForProduct({ productId, shopId }) {
    // Check product of shop valid or not
    const { product } = await clientGRPC.getProduct({
      productId,
      shopId,
    });
    const isExist = await InventoryRepository.findByProductIdAndShopId({
      productId,
      shopId,
    });
    if (isExist)
      throw new ConflictRequestError('Inventory of Product is Exist');

    if (!product) throw new BadRequestError('Product is not exist!');

    return await InventoryRepository.createInventory({
      productId,
      shopId,
    });
  }

  static async increQuantityProduct({ productId, shopId, quantity }) {
    if (quantity < 0) throw new BadRequestError('Quantity must be positive!');

    const { product } = await clientGRPC.getProduct({
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

  static async isStock({ productId, shopId, quantity }) {
    if (quantity < 0) throw new BadRequestError('Quantity must be positive!');

    const { product } = await clientGRPC.getProduct({
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
