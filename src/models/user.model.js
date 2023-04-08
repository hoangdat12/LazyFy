import { Schema, model } from "mongoose";

const COLLECTION_NAME = "user";
const DOCUMENT_NAME = "users";

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      trim: true,
      maxLength: 150,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["acitve", "inactive"],
      default: "inactive",
    },
    roles: {
      type: String,
      enum: ["ADMIN", "STAFF", "USER"],
      default: "USER",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

const _User = model(DOCUMENT_NAME, userSchema);
export default _User;
