import { InternalServerError } from '../core/error.response.js';
import _Shop from '../models/shop.model.js';
import { createShop } from '../repositories/shop.repo.js';
import { CREATED } from '../core/success.response.js';

class ShopService {
  static register = async ({ userId, payload }) => {
    const newShop = await createShop({
      payload: {
        _id: userId,
        owner: userId,
        ...payload,
      },
    });
    if (!newShop) {
      throw new InternalServerError('DB error!');
    }
    return new CREATED('Create shop successfully!', newShop);
  };
}

export default ShopService;
