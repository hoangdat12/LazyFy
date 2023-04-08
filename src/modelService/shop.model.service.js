import _Shop from "../models/shop.model.js";

const findShopById = async ({ shopId }) => {
  return _Shop.findById({ _id: shopId }).lean();
};

const createShop = async ({ payload }) => {
  return _Shop.create(payload);
};

export { findShopById, createShop };
