import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: false },
    mobile: { type: String, required: true, unique: true },
    otp: { type: String, required: false, default: null },
    otpValidTime: { type: Date, required: false, default: null },
    isAdmin: { type: Boolean, default: false, required: true },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);
export default User;