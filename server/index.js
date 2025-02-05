// initialise an Express server
const express = require('express');
const app = express();
const server = require('http').Server(app);
const config = require('./config');
const { videoToken } = require('./tokens');
const { socketIOServer } = require('./socket');
const cors = require('cors');

const PORT = 5100; // port on which the server runs
const MAX_CAPACITY = 25; // maximum capacity of the room

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cors({ origin: config.allowedURLs, methods: ['GET', 'POST'] }));
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
  try {
    res.status(200).json({
      status: 'success',
      message: 'Server is running',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Server error',
      error: error.message
    });
  }
});

// set up API routes to get access tokens from Twilio
app.get('/video/token', (req, res) => {
  const {identity, room} = req.query;
  const token = videoToken(identity, room, config);
  sendTokenResponse(token, res);
});

app.post('/video/token', (req, res) => {
  const {identity, room } = req.body;
  const token = videoToken(identity, room, config);
  sendTokenResponse(token, res);
});

// run the socket.io server on the same port
socketIOServer(server, MAX_CAPACITY);

// server running on PORT
server.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Server ready on http://localhost:${PORT}`);
});
