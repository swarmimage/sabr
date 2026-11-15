import "server-only";
import {
  Schema,
  model,
  models,
  type InferSchemaType,
  type Model,
  type Types,
} from "mongoose";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: { type: String, required: true, trim: true, maxlength: 40 },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true },
);

/** Сессия: в базе лежит только хеш токена, сам токен — в httpOnly-cookie. */
const sessionSchema = new Schema({
  tokenHash: { type: String, required: true, unique: true },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
});

const resetSchema = new Schema({
  tokenHash: { type: String, required: true, unique: true },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
});

/** Копия локального состояния пользователя. Сервер его не разбирает, только хранит и отдаёт. */
const stateSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  state: { type: Schema.Types.Mixed, required: true },
  updatedAt: { type: Number, required: true },
});

export type UserDoc = InferSchemaType<typeof userSchema> & {
  _id: Types.ObjectId;
};

const get = <T>(name: string, schema: Schema<T>) =>
  (models[name] as Model<T>) ?? model<T>(name, schema);

export const User = get("User", userSchema);
export const Session = get("Session", sessionSchema);
export const ResetToken = get("ResetToken", resetSchema);
export const UserState = get("UserState", stateSchema);
