import {
  BadRequestError,
  InternalServerError,
} from "../core/error.response.js";
import _Shop from "../models/shop.model.js";
import { findUserByUserId } from "../modelService/user.model.service.js";
import { createShop } from "../modelService/shop.model.service.js";
import { CREATED } from "../core/success.response.js";

class ShopService {
  static register = async ({ userId, payload }) => {
    const userExist = await findUserByUserId({ userId });
    if (!userExist) {
      throw new BadRequestError("User not found!");
    }
    const newShop = await createShop({
      payload: {
        _id: userId,
        owner: userId,
        ...payload,
      },
    });
    if (!newShop) {
      throw new InternalServerError("DB error!");
    }
    return new CREATED("Create shop successfully!", newShop);
  };
}

export default ShopService;
