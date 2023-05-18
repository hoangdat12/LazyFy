import { NotFoundError } from '../core/error.response.js';
import { _Product } from '../models/product.model.js';
import { getSelectFromArray, getUnSelectFromArray } from '../ultils/index.js';

const findAllDraftForShop = async ({ query, limit, skip }) => {
  return await findProductWithQuery({ query, limit, skip });
};

const findAllPublishForShop = async ({ query, limit, skip }) => {
  return await findProductWithQuery({ query, limit, skip });
};

const publishProduct = async ({ query }) => {
  const product = await _Product
    .findOneAndUpdate(
      query,
      {
        isPublished: true,
        isDraft: false,
      },
      {
        new: true,
      }
    )
    .populate('product_shop', 'name')
    .lean()
    .exec();
  if (!product) {
    throw new NotFoundError('Product not found');
  } else {
    return product;
  }
};

const unPublishProduct = async ({ query }) => {
  const product = await _Product
    .findOneAndUpdate(
      query,
      {
        isPublished: false,
        isDraft: true,
      },
      {
        new: true,
      }
    )
    .populate('product_shop', 'name')
    .lean()
    .exec();
  if (!product) {
    throw new NotFoundError('Product not found');
  } else {
    return product;
  }
};

const searchProductByUser = async ({ keyword, limit }) => {
  const result = await _Product
    .find(
      {
        isDraft: false,
        $text: { $search: keyword },
      },
      {
        score: { $meta: 'textScore' },
      }
    )
    .limit(limit)
    .sort({ score: { $meta: 'textScore' } })
    .lean();
  return result;
};

const findAllProductWithPagination = async ({
  limit,
  page,
  sort,
  filter,
  select,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
  const products = await _Product
    .find(filter)
    .skip(skip)
    .limit(limit)
    .select(getSelectFromArray(select))
    .sort(sortBy)
    .lean();
  return products;
};

const getDetailProduct = async ({ productId, unSelect }) => {
  const product = await _Product
    .findOne({
      _id: productId,
      isPublished: true,
      isDraft: false,
    })
    .select(getUnSelectFromArray(unSelect))
    .lean();
  if (!product) throw new NotFoundError('Product not found!');
  return product;
};

const updateProductOfShopForModelProduct = async ({
  productShop,
  productId,
  updated,
}) => {
  console.log(updated);
  const productUpdate = await _Product
    .findOneAndUpdate(
      {
        _id: productId,
        product_shop: productShop,
      },
      updated,
      {
        new: true,
      }
    )
    .lean();
  if (!productUpdate) throw new NotFoundError('Product not found!');
  return productUpdate;
};

const updateProductOfShop = async ({ productId, updated, model }) => {
  console.log(updated);
  const productUpdate = await model
    .findOneAndUpdate(
      {
        _id: productId,
      },
      updated,
      {
        new: true,
      }
    )
    .lean();
  if (!productUpdate) throw new NotFoundError('Product not found!');
  return productUpdate;
};

const findProductWithQuery = async ({ query, limit, skip }) => {
  return await _Product
    .find(query)
    .populate('product_shop', 'name')
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec(); // Dai dien cho viec su dung async await in Promise
};

export {
  findAllDraftForShop,
  findAllPublishForShop,
  publishProduct,
  unPublishProduct,
  searchProductByUser,
  findAllProductWithPagination,
  getDetailProduct,
  updateProductOfShopForModelProduct,
  updateProductOfShop,
};
