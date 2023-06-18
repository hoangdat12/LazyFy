import { Router } from 'express';
import { asyncHandler } from '../helpers/asyncHandler.js';
import AuthController from '../controllers/auth.controller.js';
import JwtService from '../services/jwt.service.js';

const router = Router();

router.post('/register', asyncHandler(AuthController.signUp));
router.get(
  '/active/account/:token',
  asyncHandler(AuthController.activeAccount)
);
router.post('/login', asyncHandler(AuthController.login));
router.post('/refresh-token', asyncHandler(AuthController.refreshToken));

router.get('/verify/email/:token', asyncHandler(AuthController.verifyEmail));

router.use(JwtService.verifyAccessToken);
router.patch(
  '/change/password',
  asyncHandler(AuthController.changePasswordWithMail)
);
router.patch(
  '/change/password/:secret',
  asyncHandler(AuthController.changePassword)
);
router.post('/logout', asyncHandler(AuthController.logout));

export default router;
