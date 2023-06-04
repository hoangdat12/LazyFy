import InventoryRepository from '../pg/repository/inventory.repository';

/**
 * interface data {
 *      product_id: string,
 *      inven_shop_id: number,
 *      inven_stock: number
 * }
 */
class InventoryService {
  static async createInventoryForProduct({ data }) {
    const { product_id, inven_shop_id } = data;
    // Check product of shop valid or not
    return await InventoryRepository.createInventory({
      product_id,
      inven_shop_id,
    });
  }
}

export default InventoryService;
