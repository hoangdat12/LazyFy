import { BadRequestError } from '../core/error.response.js';
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

  static async decreQuantityProduct({ productId, shopId, quantity }) {
    const { product } = clientGRPC.getProduct({
      productId,
      shopId,
    });

    const response = {
      isSuccess: true,
      message: '',
    };

    if (!product) {
      response.isSuccess = false;
      response.message = 'Product not found in Inventory';
      return response;
    }

    const invenProduct = await InventoryRepository.increQuantityProduct({
      productId,
      shopId,
      quantity: -quantity,
    });

    if (!invenProduct) {
      response.isSuccess = false;
      response.message = 'Product sell out';
      return response;
    } else return response;
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
