import { Router } from "express";
import { verifyAccessToken } from "../auth/authUltils.js";
import { asyncHandler } from "../helpers/asyncHandler.js";
import ShopController from "../controllers/shop.controller.js";

const router = Router();

router.use(verifyAccessToken);
router.post("/register", asyncHandler(ShopController.register));

export default router;
