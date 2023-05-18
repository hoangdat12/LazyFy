import { CREATED, OK } from "../core/success.response.js";
import AuthService from "../services/auth.service.js";

class AuthController {
  static signUp = async (req, res, next) => {
    try {
      const { fullName, email, password } = req.body;
      const { refreshToken, response } = await AuthService.signUp({
        fullName,
        email,
        password,
      });
      return response.send(res);
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
        "Logout success!",
        await AuthService.logout({ keyTokenId: req.keyToken.id })
      ).send(res);
    } catch (err) {
      next(err);
    }
  };

  static refreshToken = async (req, res, next) => {
    try {
      const token = req.body.refreshToken;
      const { user, accessToken, refreshToken } =
        await AuthService.refreshToken({ token });
      new OK("Refresh Token Success!", {
        user,
        accessToken,
      }).send(res);
    } catch (err) {
      next(err);
    }
  };

  static changePasswordWithEmail = async (req, res, next) => {
    try {
      const email = req.user.email;
      return (await AuthService.changePasswordWithEmail({ email })).send(res);
    } catch (err) {
      next(err);
    }
  };

  static verifyEmail = async (req, res, next) => {
    try {
      const email = req.user.email;
      const otp = req.body.otp;
      return (await AuthService.verifyEmail({ email, otp })).send(res);
    } catch (err) {
      next(err);
    }
  };

  static changePassword = async (req, res, next) => {
    try {
      const { codeSecret } = req.params;
      const email = req.user.email;
      const { olderPassword, password } = req.body;
      return (
        await AuthService.changePassword({
          email,
          olderPassword,
          password,
          codeSecret,
        })
      ).send(res);
    } catch (err) {
      next(err);
    }
  };
}

export default AuthController;
