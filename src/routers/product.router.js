import { Router } from "express";
import { asyncHandler } from "../helpers/asyncHandler.js";
import ProductController from "../controllers/product.controller.js";
import { verifyAccessToken } from "../auth/authUltils.js";

const router = Router();

router.get("/search", asyncHandler(ProductController.searchProductByUser));
router.get(
  "/detail/:productId",
  asyncHandler(ProductController.getDetailProduct)
);
router.get(
  "/pagination",
  asyncHandler(ProductController.findAllProductWithPagination)
);

router.use(verifyAccessToken);
router.post("/create", asyncHandler(ProductController.createNewProduct));
// QUERY //
router.post("/drafts/all", asyncHandler(ProductController.getAllDraftForShop));
router.post("/publish", asyncHandler(ProductController.publishProductForShop));
router.post(
  "/un-pushlish",
  asyncHandler(ProductController.unPublishProductForShop)
);
router.post(
  "/publish/all",
  asyncHandler(ProductController.getAllPublishForShop)
);
router.post("/update", asyncHandler(ProductController.updateProductOfShop));

export default router;
