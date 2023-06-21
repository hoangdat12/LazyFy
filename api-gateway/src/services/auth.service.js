import bcrypt from 'bcrypt';
import crypto from 'crypto';
import Jwt from 'jsonwebtoken';

import KeyTokenService from './keyToken.service.js';
import {
  BadRequestError,
  ConflictRequestError,
  AuthFailureError,
  ForbiddenRequestError,
  InternalServerError,
} from '../core/error.response.js';
import { OK, CREATED } from '../core/success.response.js';
import UserRepository from '../pg/repository/user.repository.js';
import JwtService from './jwt.service.js';
import KeyTokenRepository from '../pg/repository/keyToken.repository.js';
import OtpRepository from '../pg/repository/otp.repository.js';
import MailSenderService from './mailSender.service.js';
import {
  confirmEmail,
  activeAccountTemplate,
} from '../ultils/template/email.template.js';
import Producer from '../rabbitMQ/producer.js';

const mailSender = new MailSenderService();
const producerForCart = new Producer('cart_queue');

class AuthService {
  static async signUp({ firstName, lastName, email, password }) {
    const isExist = await UserRepository.findByEmail({
      email,
    });
    if (isExist) {
      throw new ConflictRequestError('Error: Email is already Exist!');
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await UserRepository.create({
      firstName,
      lastName,
      email,
      password: hashPassword,
    });
    if (newUser) {
      // Create otp
      const otp = await OtpRepository.createOtp({ email });
      // Send mail
      const link = `http://localhost:8080/api/v1/auth/active/account/${otp.token}`;
      const userName = `${newUser.firstName} ${newUser.lastName}`;
      const content = activeAccountTemplate(userName, link);
      await mailSender.sendEmailWithText({
        recipient: email,
        subject: 'Change Password',
        content,
      });
      // Delele older account don't active
      UserRepository.deleteOlderAccount();

      return new CREATED(
        `We send email ${email} an account activation link, please follow the instructions to activate your account`,
        'Success!'
      );
    } else throw new InternalServerError('DB error!');

    // let metadata = null;
    // let message = '';

    // if (newUser) {
    //   const { privateKey, publicKey } = this.generatePrivatePublicKey();

    //   const { accessToken, refreshToken } = await JwtService.createTokenPair({
    //     payload: {
    //       id: newUser.id,
    //       email: newUser.email,
    //     },
    //     privateKey,
    //   });

    //   await KeyTokenService.createKeyToken({
    //     userId: newUser.id,
    //     publicKey,
    //     privateKey,
    //     refreshToken,
    //   });

    //   metadata = {
    //     user: newUser,
    //     token: accessToken,
    //   };
    //   message = 'Create Account Success!';
    //   return {
    //     refreshToken,
    //     response: new CREATED(metadata, message),
    //   };
    // } else {
    //   message = 'Create Account Failure!';
    //   return {
    //     refreshToken: null,
    //     response: new OK(metadata, message),
    //   };
    // }
  }

  static activeAccount = async ({ token }) => {
    const otpExist = await OtpRepository.findByToken({ token });
    if (!otpExist) throw new BadRequestError('Token not valid!');

    const userExist = await UserRepository.findByEmail({
      email: otpExist.email,
      active: 'inactive',
    });
    if (!userExist) throw new BadRequestError('User not found!');

    // delete token
    OtpRepository.deleteOlderOtp();
    OtpRepository.deleteBySecret({ secret: otpExist.secret });

    // Create cart for user
    producerForCart.sendMessage({
      type: 'create',
      data: {
        userId: userExist.id,
      },
    });

    return new OK(
      await UserRepository.activeAccount({ email: otpExist.email }),
      'Active account successfully!'
    );
  };

  static login = async ({ email, password }) => {
    const user = await UserRepository.findByEmail({ email });
    if (!user) {
      throw new BadRequestError('User not register!');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new AuthFailureError('Authorization Error!');
    }

    const { privateKey, publicKey } = this.generatePrivatePublicKey();

    const { accessToken, refreshToken } = await JwtService.createTokenPair({
      payload: {
        id: user.id,
        email: user.email,
      },
      privateKey,
    });

    await KeyTokenService.createKeyToken({
      userId: user.id,
      publicKey,
      privateKey,
      refreshToken,
    });

    const metadata = {
      user,
      token: accessToken,
    };
    const message = 'Login success!';
    return {
      refreshToken,
      response: new OK(metadata, message),
    };
  };

  static logout = async ({ keyTokenId }) => {
    const delKey = await KeyTokenRepository.deleteById({
      keyTokenId,
    });
    return delKey;
  };

  static refreshToken = async ({ token }) => {
    // Check refreshToken is Used?
    const foundToken = await KeyTokenRepository.findByRefreshTokenUsed({
      refreshToken: token,
    });
    if (foundToken) {
      // Check user use this refresh Token
      const { id, email } = Jwt.verify(token, foundToken.publicKey, {
        algorithm: 'RS256',
      });
      console.log(`Refresh Token is used::::userEmail:${email}:::id:${id}"`);
      // Delete All KeyToken
      await KeyTokenRepository.deleteById(foundToken.id);
      throw new ForbiddenRequestError(
        'Something wrong happend, Please relogin!'
      );
    }
    const holderToken = await KeyTokenRepository.findByRefershToken({
      refreshToken: token,
    });
    if (!holderToken) throw new BadRequestError('Invalid Token!');
    const { id, email } = Jwt.verify(token, holderToken.public_key, {
      algorithm: 'RS256',
    });

    const isValidUser = await UserRepository.findById({ userId: id });
    if (!isValidUser) throw new BadRequestError('User not found!');

    const { accessToken, refreshToken } = await JwtService.createTokenPair({
      payload: { id, email },
      privateKey: holderToken.private_key,
    });
    // This error
    await KeyTokenRepository.updateByUserId({
      userId: id,
      newRefreshToken: refreshToken,
      olderRefreshToken: token,
    });

    return {
      user: { id, email },
      accessToken,
      refreshToken,
    };
  };

  static changePasswordWithMail = async ({ email }) => {
    const userExist = await UserRepository.findByEmail({ email });
    if (!userExist) {
      throw new BadRequestError('Email not found!');
    }
    // Create
    const newOtp = await OtpRepository.createOtp({ email });
    if (!newOtp) {
      throw new InternalServerError('Db error!');
    }
    // Send Otp to Email
    const link = `http://localhost:8080/verify/email/${newOtp.token}`;
    const userName = `${userExist.firstName} ${userExist.lastName}`;
    const content = confirmEmail(userName, link);
    await mailSender.sendEmailWithText({
      recipient: email,
      subject: 'Change Password',
      content,
    });

    return new OK(
      `We send email ${email} verify email link, please follow the instructions to verify your email`,
      'Success!'
    );
  };

  static verifyEmail = async ({ token }) => {
    const tokenExist = await OtpRepository.findByToken({ token });
    if (!tokenExist) throw new BadRequestError('Token not valid');

    return true;
  };

  static changePassword = async ({
    email,
    olderPassword,
    newPassword,
    secret,
  }) => {
    // Check code invalid or not
    const otp = await OtpRepository.findBySecret({ secret, email });
    if (!otp) {
      throw new BadRequestError('Otp expires!');
    }
    if (otp.email !== email)
      throw new ForbiddenRequestError(
        'Your not permission to change password!'
      );

    // Check user
    const user = await UserRepository.findByEmail({ email });
    if (!user) {
      throw new BadRequestError('User not found!');
    }

    // Check password
    const isValid = await bcrypt.compare(olderPassword, user.password);
    if (!isValid) {
      throw new BadRequestError('Invalid older password!');
    }
    // Change password
    // Error
    const hashPassword = bcrypt.hashSync(newPassword, 10);
    const userUpdate = await UserRepository.changePassword({
      email,
      newPassword: hashPassword,
    });
    if (!userUpdate) {
      throw new InternalServerError('DB error!');
    }

    // delete otp
    OtpRepository.deleteBySecret({ secret: otp.secret });
    OtpRepository.deleteOlderOtp();

    return new OK('Change password success!');
  };

  static generatePrivatePublicKey = () => {
    return crypto.generateKeyPairSync('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: 'pkcs1',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs1',
        format: 'pem',
      },
    });
  };
}
export default AuthService;
