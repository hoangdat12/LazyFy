import { query } from '../db.query';

const DATABASE_NAME = 'key-token';

class InventoryRepository {
  static async createInventory({ product_id, inven_shop_id }) {
    const queryString = {
      text: `
              INSERT INTO "${DATABASE_NAME}" (product_id, inven_shop_id)
              VALUES ($1, $2)
              RETURNING product_id
          `,
      values: [product_id, inven_shop_id],
    };

    const data = await query(queryString);
    return data;
  }
}

export default InventoryRepository;
