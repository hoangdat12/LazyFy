import bcrypt from "bcrypt";
import crypto from "crypto";
import Jwt from "jsonwebtoken";

import _User from "../models/user.model.js";
import _Otp, { findOneAndUpdateOtp } from "../models/otp.model.js";
import KeyTokenService from "./keyToken.service.js";
import { createTokenPair } from "../auth/authUltils.js";
import { getInforData } from "../ultils/index.js";
import {
  findOneAndUpdateUser,
  findUserByEmail,
  findUserByUserId,
} from "../modelService/user.model.service.js";
import { findOtpByEmail, createOtp } from "../models/otp.model.js";
import {
  removeKeyTokenById,
  findKeyTokenUsedByRefreshToken,
  deleteKeyTokenById,
  findKeyTokenByRefreshToken,
} from "../modelService/keyToken.model.service.js";
import {
  BadRequestError,
  ConflictRequestError,
  InternalServerError,
  AuthFailureError,
  ForbiddenRequestError,
} from "../core/error.response.js";
import { OK, CREATED } from "../core/success.response.js";
import sendMail from "../helpers/mailSender.js";
import { changePasswordTemplate } from "../ultils/emailTemplate.js";

class AuthService {
  static signUp = async ({ fullName, email, password }) => {
    // Lean giup query nhanh. Neu co lean se giam tai Size() cua Object
    // Neu khong lean se return Object cua mongoose, Neu co lean se tra
    // ve Object cua javascript thuan tuy nen Size() nho
    const isExist = await findUserByEmail({ email });
    if (isExist) {
      throw new ConflictRequestError("Error: Email is already Exist!");
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await _User.create({
      fullName,
      email,
      password: hashPassword,
    });

    let metadata = null;
    let message = "";

    if (newUser) {
      const { privateKey, publicKey } = this.generatePrivatePublicKey();

      const publicKeyString = await KeyTokenService.createKeyToken({
        userId: newUser.id,
        publicKey,
      });

      if (!publicKeyString) {
        throw new InternalServerError("Error: Public Key Error!");
      }

      // Using verify access token
      // const publicKeyObject = crypto.createPrivateKey(publicKeyString);

      const { accessToken, refreshToken } = await createTokenPair({
        payload: {
          id: newUser.id,
          email: newUser.email,
        },
        privateKey,
      });

      metadata = {
        user: getInforData({
          fields: ["_id", "fullName", "email", "roles", "status", "isActive"],
          objects: newUser,
        }),
        token: accessToken,
      };
      message = "Create Account Success!";
      return {
        refreshToken,
        response: new CREATED(message, metadata),
      };
    } else {
      message = "Create Account Failure!";
      return {
        refreshToken: null,
        response: new OK(message, metadata),
      };
    }
  };

  static login = async ({ email, password }) => {
    const user = await findUserByEmail({ email });
    if (!user) {
      throw new BadRequestError("User not register!");
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new AuthFailureError("Authorization Error!");
    }

    const { privateKey, publicKey } = this.generatePrivatePublicKey();

    const { accessToken, refreshToken } = await createTokenPair({
      payload: {
        id: user._id,
        email: user.email,
      },
      privateKey,
    });

    await KeyTokenService.createKeyToken({
      userId: user._id,
      publicKey,
      privateKey,
      refreshToken,
    });

    const metadata = {
      user,
      token: accessToken,
    };
    const message = "Login success!";
    return {
      refreshToken,
      response: new OK(message, metadata),
    };
  };

  static logout = async ({ keyTokenId }) => {
    const delKey = await removeKeyTokenById({ id: keyTokenId });
    return delKey;
  };

  static refreshToken = async ({ token }) => {
    // Check refreshToken is Used?
    const foundToken = await findKeyTokenUsedByRefreshToken({
      refreshToken: token,
    });
    if (foundToken) {
      // Check user use this refresh Token
      const { id, email } = Jwt.verify(token, foundToken.publicKey, {
        algorithm: "RS256",
      });
      console.log(`Refresh Token is used::::userEmail:${email}:::id:${id}"`);
      // Delete All KeyToken
      await deleteKeyTokenById(foundToken.id);
      throw new ForbiddenRequestError(
        "Something wrong happend, Please relogin!"
      );
    }
    const holderToken = await findKeyTokenByRefreshToken({
      refreshToken: token,
    });
    if (!holderToken) throw new BadRequestError("Invalid Token!");

    const { id, email } = Jwt.verify(token, holderToken.publicKey, {
      algorithm: "RS256",
    });

    const isValidUser = await findUserByUserId({ userId: id });
    if (!isValidUser) throw new BadRequestError("User not found!");

    const { accessToken, refreshToken } = await createTokenPair({
      payload: { id, email },
      privateKey: holderToken.privateKey,
    });
    // This error
    await holderToken.updateOne({
      $set: {
        refreshToken,
      },
      $addToSet: {
        refreshTokenUsed: refreshToken,
      },
    });

    return {
      user: { id, email },
      accessToken,
      refreshToken,
    };
  };

  static changePasswordWithEmail = async ({ email }) => {
    const userExist = await findUserByEmail({ email });
    if (!userExist) {
      throw new BadRequestError("email not found!");
    }
    // Create Otp
    const otp = crypto.randomInt(1000000);
    const otpString = otp.toString().padStart(6, "0");
    // Save Otp
    const newOtp = await createOtp({ email, otp: otpString, secret: null });
    console.log(newOtp);
    if (!newOtp) {
      throw new InternalServerError("Db error!");
    }
    // Send Otp to Email
    // sendMail({
    //   email,
    //   content: changePasswordTemplate,
    //   subject: "Verify Email Change Password",
    // });
    const messgae =
      "We have sent a notification to your email for verification, please follow the instructions to change your password.";
    return new OK(messgae);
  };

  static verifyEmail = async ({ email, otp }) => {
    // Verify Otp
    // 1. Get Otp from Db
    // 2. Verify
    const otpVerify = await findOtpByEmail({ email });
    if (!otpVerify) {
      throw new BadRequestError("Invalid email!");
    }
    if (otp !== otpVerify.otp) {
      throw new BadRequestError("Invalid otp!");
    }
    // Create Uri
    const token = crypto.randomBytes(10).toString("hex");
    console.log(token);
    const uri = `http://localhost:8080/api/v1/auth/change-password/${token}`;
    // Create secret key
    const query = { email };
    const update = { secret: token };
    await findOneAndUpdateOtp(query, update);

    return new OK("Success!", {
      uri,
    });
  };

  static changePassword = async ({
    email,
    olderPassword,
    password,
    codeSecret,
  }) => {
    // Check code invalid or not
    const otp = await findOtpByEmail({ email });
    if (!otp) {
      throw new BadRequestError("Otp expires!");
    }
    console.log(otp, codeSecret);
    if (otp.secret !== codeSecret) {
      throw new BadRequestError("Request not found!");
    }

    // Check user
    const user = await findUserByEmail({ email });
    if (!user) {
      throw new BadRequestError("Email not register!");
    }

    // Check password
    const isValid = await bcrypt.compare(olderPassword, user.password);
    if (!isValid) {
      throw new BadRequestError("Invalid older password!");
    }
    // Change password
    // Error
    const hashPassword = bcrypt.hashSync(password, 10);
    const query = { email: email };
    const update = { password: hashPassword };
    const userUpdate = await findOneAndUpdateUser(query, update);
    if (!userUpdate) {
      throw new InternalServerError("DB error!");
    }
    return new OK("Change password success!");
  };

  static generatePrivatePublicKey = () => {
    return crypto.generateKeyPairSync("rsa", {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
    });
  };
}
export default AuthService;
