import pkg from 'twilio';
const { jwt } = pkg;
const AccessToken = jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;

const generateToken = (config) => {
  if (!config.accountSid || !config.apiKey || !config.apiSecret) {
    throw new Error('Twilio credentials are not properly configured.');
  }

  return new AccessToken(
    config.accountSid,
    config.apiKey,
    config.apiSecret
  );
};

const videoToken = (identity, room, config) => {
  if (!identity) {
    throw new Error('Identity is required to generate a token.');
  }

  let videoGrant;
  if (room) videoGrant = new VideoGrant({ room });
  else videoGrant = new VideoGrant();

  const token = generateToken(config);
  token.addGrant(videoGrant);
  token.identity = identity;
  return token;
};

export default videoToken;