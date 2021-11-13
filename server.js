const http = require('http');
const path = require('path');
const crypto = require('crypto');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');

const sequelize = require('./utils/database');

const usersRoute = require('./routes/users');
const messageRoute = require('./routes/messages');

const Message = require('./models/message');

const app = express();

const server = http.createServer(app);
const io = require('socket.io')(server);

const fileStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'client/public/avatars');
  },
  filename: (req, file, callback) => {
    crypto.randomBytes(20, (err, buffer) => {
      const name = Date.now() + buffer.toString('hex') + '.' + file.originalname.split('.').reverse()[0];
      callback(null, name);
    });
  }
});

const fileFilter = (req, file, callback) => {
  const fileTypes = ['image/png', 'image/jpg', 'image/jpeg'];
  if (fileTypes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('avatar'));

app.use('/client/public/avatars', express.static(path.join(__dirname, 'client/public/avatars')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/api/users', usersRoute);
app.use('/api/messages', messageRoute);

io.on('connection', socket => {
  console.log('Client Connected!');

  socket.on('createMessage', data => {
    socket.emit('createMessage', data);
  });

  socket.on('updateTime', data => {
    Message.update({
      receiver_time: data.receiver_time
    }, {
      where: {
        sender: data.sender,
        receiver: data.receiver,
        sender_time: data.sender_time,
      }
    })
  })
})

const port = parseInt(process.env.PORT, 10) || 7000;

sequelize.sync()
  .then(() => {
    console.log('PostgresDB Connected!');
    // app.set('port', port);
    // const server = http.createServer(app);
    server.listen(port, () => console.log(`Server is running on port: ${port}`));
  })
  .catch(err => console.log(`DB Connection Error: ${err}`));
