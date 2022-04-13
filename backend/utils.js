import jwt from 'jsonwebtoken';
import axios from 'axios';

export const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d',
    }
  );
};
export const sendOtp = async (mobile, otp) => {
  let creatToken = await createToken();
  const headers = {
    'Content-Type': 'application/json',
    'x-sms-ir-secure-token': creatToken.TokenKey,
  };
  const body = {
    Code: otp,
    MobileNumber: mobile,
  };
  axios
    .post(`https://RestfulSms.com/api/VerificationCode`, body, {
      headers: headers,
    })
    .then((response) => {})
    .catch((error) => {});
};

const createToken = async () => {
  const { data } = await axios.post(`https://RestfulSms.com/api/Token`, {
    headers: {
      'Content-Type': 'application/json',
    },
    UserApiKey: process.env.smsIrApiKey,
    SecretKey: process.env.smsIrSecretKey,
  });
  return data;
};