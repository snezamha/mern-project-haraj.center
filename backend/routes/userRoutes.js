import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import { sendOtp ,generateToken } from '../utils.js';

const userRouter = express.Router();

userRouter.post(
  '/login',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ mobile: req.body.mobile });
    var randNumber = Math.floor(1000 + Math.random() * 9000);
    var currentDate = new Date();
    var twoMinutesLater = new Date(currentDate.getTime() + 2 * 60 * 1000);
    if (user) {
      if (checkValidOtp(user.otpValidTime)) {
        user.otp = randNumber;
        user.otpValidTime = twoMinutesLater;
        await user.save();
        sendOtp(req.body.mobile, randNumber);
        res.send({
          mobile: req.body.mobile,
        });
      } else {
        res.status(401).send({
          message:
            'شما به تازگی کد تایید دریافت کرده اید. لطفا پس از ' +
            countSecons(user.otpValidTime.getTime()) +
            'مجدد تلاش کنید!',
        });
      }
    } else {
      const newUser = new User({
        fullName: null,
        mobile: req.body.mobile,
        otp: randNumber,
        otpValidTime: twoMinutesLater,
        isAdmin: false,
      });
      const user = await newUser.save();
      sendOtp(req.body.mobile, randNumber);
      res.send({
        mobile: req.body.mobile,
      });
    }
  })
);
userRouter.post(
  '/verify',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ mobile: req.body.mobile });
    var currentDate = new Date();
    var diff = Math.floor(
      (user.otpValidTime.getTime() - currentDate.getTime()) / 1000
    );
    if (diff < 0) {
      res.status(401).send({ message: 'مدت اعتبار کد به پایان رسیده است' });
    }
    if (user && req.body.code == user.otp) {
      res.send({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user),
      });
      return;
    } else {
      res.status(401).send({ message: 'کد تایید ارسالی صحیح نمی باشد' });
    }
  })
);
function checkValidOtp(otpValidTime) {
  var currentDate = new Date();
  var diff = Math.floor(
    (otpValidTime.getTime() - currentDate.getTime()) / 1000
  );
  if (diff < 0) {
    return true;
  }
}
function countSecons(time) {
  var currentDate = new Date();
  var diff = Math.floor((time - currentDate.getTime()) / 1000);
  return diff + ' ثانیه ';
}
export default userRouter;
