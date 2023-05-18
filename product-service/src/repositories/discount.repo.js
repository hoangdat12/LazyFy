import _Discount from "../../models/discount.model.js";
import { getUnSelectFromArray } from "../../ultils/index.js";

const findDiscountByCodeAndShopId = async ({ code, shopId }) => {
  return await _Discount
    .findOne({
      discount_code: code,
      discount_shopId: shopId,
    })
    .lean();
};

const findAllDiscountCodeUnSelect = async ({
  limit = 50,
  page = 1,
  sort = "ctime",
  filter,
  unSelect,
  model,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const products = await model
    .find(filter)
    .skip(skip)
    .limit(limit)
    .select(getUnSelectFromArray(unSelect))
    .sort(sortBy)
    .lean();

  return products;
};

const checkDiscountExists = async (model, filter) => {
  return await model.findOne(filter).lean();
};

export {
  findDiscountByCodeAndShopId,
  findAllDiscountCodeUnSelect,
  checkDiscountExists,
};
