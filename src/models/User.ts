import mongoose, {
  Document,
  Model,
  CallbackWithoutResultAndOptionalError,
} from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  password: string;
  active?: boolean;
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: [true, "Please provide your name!"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

userSchema.pre<IUser>(
  "save",
  async function (next: CallbackWithoutResultAndOptionalError) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
  }
);

export const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
