import { OK } from '../core/success.response.js';
import AuthService from '../services/auth.service.js';

class AuthController {
  static signUp = async (req, res, next) => {
    try {
      const { firstName, lastName, email, password } = req.body;
      const response = await AuthService.signUp({
        firstName,
        lastName,
        email,
        password,
      });
      // req.cookies("refreshToken", refreshToken)
      return response.send(res);
    } catch (err) {
      next(err);
    }
  };

  static activeAccount = async (req, res, next) => {
    try {
      const token = req.params.token;

      return (await AuthService.activeAccount({ token })).send(res);
    } catch (err) {
      next(err);
    }
  };

  static login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const { refreshToken, response } = await AuthService.login({
        email,
        password,
      });
      console.log(refreshToken);
      // req.cookie()
      return response.send(res);
    } catch (err) {
      console.log(err);
      next(err);
    }
  };

  static logout = async (req, res, next) => {
    try {
      new OK(
        await AuthService.logout({ keyTokenId: req.keyToken.id }),
        'Logout success!'
      ).send(res);
    } catch (err) {
      next(err);
    }
  };

  static refreshToken = async (req, res, next) => {
    try {
      // get refresh-token from cookies
      const token = req.cookies['refresh-token'];
      const { user, accessToken, refreshToken } =
        await AuthService.refreshToken({ token });
      new OK(
        {
          user,
          accessToken,
        },
        'Refresh Token Success!'
      ).send(res);
    } catch (err) {
      next(err);
    }
  };

  static changePasswordWithMail = async (req, res, next) => {
    try {
      const email = req.user.email;
      return (
        await AuthService.changePasswordWithMail({
          email,
        })
      ).send(res);
    } catch (err) {
      next(err);
    }
  };

  static verifyEmail = async (req, res, next) => {
    try {
      const token = req.params.token;

      const isValid = await AuthService.verifyEmail({ token });
      return new OK({ isValid }).send(res);
    } catch (err) {
      next(err);
    }
  };

  static changePassword = async (req, res, next) => {
    try {
      const user = req.user;
      const secret = req.params.secret;
      const { olderPassword, newPassword } = req.body;

      return (
        await AuthService.changePassword({
          email: user.email,
          olderPassword,
          newPassword,
          secret,
        })
      ).send(res);
    } catch (err) {
      next(err);
    }
  };
}

export default AuthController;
