import { Router } from 'express';
import { asyncHandler } from '../helpers/asyncHandler.js';
import ProductController from '../controllers/product.controller.js';
import verifyAccessToken from '../middleware/verifyAccessToken.js';

const router = Router();

// Not need jwt and header
router.get(
  '/detail/:productId',
  asyncHandler(ProductController.getDetailProduct)
);
router.get('/search', asyncHandler(ProductController.searchProductByUser));
router.get(
  '/pagination',
  asyncHandler(ProductController.findAllProductWithPagination)
);

router.use(verifyAccessToken);
// Need jwt and header
router.post('/create', asyncHandler(ProductController.createNewProduct));
// QUERY //
router.get(
  '/drafts/:shopId',
  asyncHandler(ProductController.getAllDraftForShop)
);
router.post('/publish', asyncHandler(ProductController.publishProductForShop));
router.post(
  '/un-pushlish',
  asyncHandler(ProductController.unPublishProductForShop)
);
router.get(
  '/publish/:shopId',
  asyncHandler(ProductController.getAllPublishForShop)
);
router.patch(
  '/:productId',
  asyncHandler(ProductController.updateProductOfShop)
);
// router.delete(
//   '/:productId',
//   asyncHandler(ProductController.de)
// );

export default router;
