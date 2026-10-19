import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export const STARTING_VP = 5000;
const BCRYPT_ROUNDS = 12;

const inventoryItemSchema = new mongoose.Schema(
  {
    itemId: { type: String, required: true },
    pricePaid: { type: Number, required: true, min: 0 },
    purchasedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true, minlength: 3, maxlength: 20 },
    email: { type: String, required: true, trim: true, lowercase: true },
    password: { type: String, required: true, select: false },
    valorantPoints: { type: Number, default: STARTING_VP, min: 0 },
    inventory: { type: [inventoryItemSchema], default: [] },
    favoriteAgents: { type: [String], default: [] },
    lastDailyRewardAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
      },
    },
  },
);

userSchema.index({ email: 1 }, { unique: true });
// Case-insensitive uniqueness: "Phoenix" and "phoenix" cannot both register.
userSchema.index({ username: 1 }, { unique: true, collation: { locale: "en", strength: 2 } });

userSchema.pre("save", async function hashPassword() {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, BCRYPT_ROUNDS);
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

export const User = mongoose.models.User ?? mongoose.model("User", userSchema);
