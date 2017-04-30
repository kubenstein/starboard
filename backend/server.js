const express = require('express');
const SocketIo = require('socket.io');

// ------------- serv setup ---------------
const app = express();
const server = app.listen(process.env.PORT || 8081);
const io = SocketIo(server);

app.use(express.static('build/'));

// -------------- webSockets --------------

io.on('connection', (socket) => {
  //
  // TODO: notify about async new events


  socket.on('addEvent', (event, sendBack) => {
    //
    // TODO: persist
    sendBack(event);
  });

  socket.on('getAllPastEvents', (sendBack) => {
    //
    // TODO: fetch
    sendBack([]);
  });
});
