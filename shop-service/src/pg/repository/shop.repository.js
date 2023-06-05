import { query } from '../db.query.js';

class ShopRepository {
  DATABASE_NAME = 'shop';
  static async createNewShop({ shop_owner, shop_name }) {
    const queryString = {
      text: `
          INSERT INTO "${this.DATABASE_NAME}" (shop_owner, shop_name)
          VALUES ($1, $2)
      `,
      values: [shop_owner, shop_name],
    };
    const res = await query(queryString);
    return res[0];
  }
}

export default ShopRepository;
