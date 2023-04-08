import { Router } from "express";
import { asyncHandler } from "../helpers/asyncHandler.js";
import ProductController from "../controllers/product.controller.js";
import { verifyAccessToken } from "../auth/authUltils.js";

const router = Router();

router.use(verifyAccessToken);
router.post("/create", asyncHandler(ProductController.createNewProduct));

export default router;
