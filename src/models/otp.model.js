import { Schema, model } from "mongoose";

const DOCUMENT_NAME = "otp";
const COLLECTION_NAME = "otps";

const otpSchema = new Schema(
  {
    email: { type: String, required: true },
    otp: { type: String, required: true },
    secret: { type: String },
    createdAt: { type: Date, expires: 900, default: Date.now },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

const _Otp = model(DOCUMENT_NAME, otpSchema);

const findOtpByEmail = ({ email }) => {
  return _Otp.findOne({ email }).lean();
};

const findOtpByOtp = ({ otp }) => {
  return _Otp.findOne({ otp }).lean();
};

const findOneAndUpdateOtp = (
  query,
  update,
  options = { new: true, upset: true }
) => {
  return _Otp.findOneAndUpdate(query, update, options).lean();
};

const createOtp = ({ email, otp, secret }) => {
  return _Otp.create({ email, otp, secret });
};

export default _Otp;
export { findOtpByEmail, findOtpByOtp, createOtp, findOneAndUpdateOtp };
