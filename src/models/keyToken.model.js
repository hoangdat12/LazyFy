import { Schema, model } from "mongoose";

const COLLECTION_NAME = "KeyToken";
const DOCUMENT_NAME = "KeyToken";

const keyTokenSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: "User",
    },
    publicKey: {
      type: String,
      require: true,
    },
    privateKey: {
      type: String,
      require: true,
    },
    refreshTokensUsed: {
      type: Array,
      default: [],
    },
    refreshToken: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

const _KeyToken = model(DOCUMENT_NAME, keyTokenSchema);
export default _KeyToken;
