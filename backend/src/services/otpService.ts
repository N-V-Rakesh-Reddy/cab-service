import axios from 'axios';

export const sendOtp = async (mobile: string) => {
  const apiKey = process.env.TWO_FACTOR_API_KEY;
  const url = `https://2factor.in/API/V1/${apiKey}/SMS/${mobile}/AUTOGEN`;

  const response = await axios.get(url);
  return response.data; // Contains Status, Details (session ID)
};

export const verifyOtp = async (sessionId: string, otp: string) => {
  const apiKey = process.env.TWO_FACTOR_API_KEY;
  const url = `https://2factor.in/API/V1/${apiKey}/SMS/VERIFY/${sessionId}/${otp}`;

  const response = await axios.get(url);
  return response.data; // Contains Status, Details
};
