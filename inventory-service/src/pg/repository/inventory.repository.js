import { query } from '../db.query';

const DATABASE_NAME = 'key-token';

class InventoryRepository {
  static async createInventory({ productId, shopId }) {
    const queryString = {
      text: `
        INSERT INTO "${DATABASE_NAME}" (product_id, inven_shop_id)
        VALUES ($1, $2)
        RETURNING inven_product_id
      `,
      values: [productId, shopId],
    };

    const data = await query(queryString);
    return data[0];
  }

  static async findByProductIdAndShopId({ productId, shopId }) {
    const queryString = `
        SELECT * FROM "${DATABASE_NAME}" 
        WHERE inven_product_id = "${productId}" 
          AND
          inven_shop_id = "${shopId}" 
      `;
    const data = await query(queryString);
    return data[0];
  }

  static async increQuantityProduct({ productId, shopId, quantity }) {
    const queryString = `
      UPDATE "${DATABASE_NAME}"
      SET inven_stock = inven_stock + ${quantity}
      WHERE inven_product_id = "${productId}" 
        AND
        inven_shop_id = "${shopId}"
      RETURNING inven_product_id, inven_stock
    `;
    const data = await query(queryString);
    return data[0];
  }
}

export default InventoryRepository;
