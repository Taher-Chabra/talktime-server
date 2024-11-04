import dotenv from 'dotenv';
dotenv.config();

export const twilioConfig = {
  accountSid: process.env.TWILIO_ACCOUNT_SID,
  apiKey: process.env.TWILIO_API_KEY,
  apiSecret: process.env.TWILIO_API_SECRET,
};
export const url = {
  client: 'http://localhost:3000',
};
export const allowedURLs = ['http://localhost:3000', 'my_deployed_url'];