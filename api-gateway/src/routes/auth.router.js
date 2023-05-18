import { Router } from "express";
import { asyncHandler } from "../helpers/asyncHandler.js";
import AuthController from "../controllers/auth.controller.js";
import JwtService from "../services/jwt.service.js";

const router = Router();

router.post("/register", asyncHandler(AuthController.signUp));
router.post("/login", asyncHandler(AuthController.login));
router.post("/refresh-token", asyncHandler(AuthController.refreshToken));

router.use(JwtService.verifyAccessToken);
router.post("/logout", asyncHandler(AuthController.logout));
// router.post(
//   "/change-password",
//   asyncHandler(AuthController.changePasswordWithEmail)
// );
// router.post("/verify", asyncHandler(AuthController.verifyEmail));
// router.post(
//   "/change-password/:codeSecret",
//   asyncHandler(AuthController.changePassword)
// );

export default router;
