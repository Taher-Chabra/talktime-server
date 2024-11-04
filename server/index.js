// initialise an Express server
import express from 'express';
import http from 'http';
import {twilioConfig, allowedURLs} from './config.js';
import videoToken from './tokens.js';
import socketIOServer from './socket.js';
import cors from 'cors';

const app = express();
const server = http.createServer(app);
const PORT = 5100; // port on which the server runs
const MAX_CAPACITY = 25; // maximum capacity of the room

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cors({ origin: allowedURLs, methods: ['GET', 'POST'] }));
app.use(express.json());

const sendTokenResponse = (token, res) => {
  res.set('Content-Type', 'application/json');
  res.send(
    JSON.stringify({
      token: token.toJwt(),
    })
  );
};

app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

// set up API routes to get access tokens from Twilio
app.get('/video/token', (req, res) => {
  const identity = req.query.identity;
  const room = req.query.room;

  if (!identity) {
    return res.status(400).json({ error: 'Identity is required' });
  }

  try {
    const token = videoToken(identity, room, twilioConfig);
    sendTokenResponse(token, res);
  } catch (error) {
    console.error('Error generating token:', error);
    res.status(500).json({ error: 'Failed to generate token' });
  }
});

app.post('/video/token', (req, res) => {
  const identity = req.body.identity;
  const room = req.body.room;

  if (!identity) {
    return res.status(400).json({ error: 'Identity is required' });
  }

  try {
    const token = videoToken(identity, room, twilioConfig);
    sendTokenResponse(token, res);
  } catch (error) {
    console.error('Error generating token:', error);
    res.status(500).json({ error: 'Failed to generate token' });
  }
});

// run the socket.io server on the same port
socketIOServer(server, MAX_CAPACITY);

// server running on PORT
server.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Server ready on http://localhost:${PORT}`);
});