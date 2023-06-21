import { query } from '../db.query.js';

const DATABASE_NAME = 'shop';

class ShopRepository {
  static async createNewShop({ shop_owner, shop_name }) {
    const queryString = {
      text: `
          INSERT INTO "${DATABASE_NAME}" (id, shop_owner, shop_name)
          VALUES ($1, $2, $3)
          RETURNING *
      `,
      values: [shop_owner, shop_owner, shop_name],
    };
    const res = await query(queryString);
    return res[0];
  }

  static async findByShopOwnerOrShopName({ shop_owner, shop_name }) {
    const queryString = `
      SELECT * FROM ${DATABASE_NAME}
      WHERE shop_owner = '${shop_owner}' OR shop_name = '${shop_name}'
    `;
    const res = await query(queryString);
    return res[0];
  }

  static async findByShopOwner({ shop_owner, shop_name }) {
    const queryString = `
      SELECT * FROM ${DATABASE_NAME}
      WHERE shop_owner = '${shop_owner}' 
    `;
    const res = await query(queryString);
    return res[0];
  }

  static async findByShopId({ shopId }) {
    const queryString = `
      SELECT * FROM ${DATABASE_NAME}
      WHERE id = '${shopId}' 
    `;
    const res = await query(queryString);
    return res[0];
  }
}

export default ShopRepository;
