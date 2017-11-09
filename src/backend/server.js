/* eslint-disable no-multi-spaces */

import path from 'path';
import express from 'express';
import SocketIo from 'socket.io';
import multer from 'multer';
import bodyParser from 'body-parser';
// import StoreFileUsecase from 'lib/usecases/store-file-usecase';
// import SendFileUsecase from 'lib/usecases/send-file-usecase';
// import EventProcessorsQueue from 'lib/event-processors-queue';
// import State from 'lib/state';
// import AllowEveryoneAuth from 'lib/allow-everyone-auth';
import NullLogger from 'lib/null-logger';
import { hasToBeSet } from 'lib/utils';
import { permissionDeniedEvent } from 'lib/event-definitions';

export default class Server {
  constructor(params) {
    // this.eventStorage    = params.eventStorage    || hasToBeSet('eventStorage');
    // this.filesStorage    = params.filesStorage    || hasToBeSet('filesStorage');
    this.serverPort      = params.port            || 9000;
    this.uploadsDir      = params.uploadsDir      || path.resolve('.tmp/tmpUploads/');
    this.publicFilesDir  = params.publicFilesDir  || path.resolve('.tmp/public/');
    this.logger          = params.logger          || new NullLogger();
    // this.auth            = params.auth            || new AllowEveryoneAuth();
    this.noBanner        = params.noBanner        || false;
    // this.eventProcessors = params.eventProcessors || [];
    // this.state           = params.state           || new State({ eventStorage: this.eventStorage });
    this.strategy        = params.strategy        || hasToBeSet('strategy');
    this.server           = null;
    this.sockets          = {};
    // this.sendFileUsecase  = new SendFileUsecase({ filesStorage: this.filesStorage });
    // this.storeFileUsecase = new StoreFileUsecase({
    //   filesStorage: this.filesStorage,
    //   eventStorage: this.eventStorage,
    // });
    // this.incommingEventProcessors = new EventProcessorsQueue({
    //   stateManager: this.state,
    //   processors: this.eventProcessors,
    // });
  }

  displayBanner() {
    // eslint-disable-next-line no-console
    console.log(`
    |
    | Starting Starboard...
    | ${this.eventStorage.welcomeInfo().replace('\n', '    |\n')}
    |
    | Board available at: http://localhost:${this.serverPort}/
    |
    `);
  }

  start() {
    if (!this.noBanner) {
      this.displayBanner();
    }

    const app    = express();
    const server = app.listen(this.serverPort);
    const io     = SocketIo(server);
    const upload = multer({ dest: this.uploadsDir });

    this.server = server;

    app.use(express.static(path.resolve(`${__dirname}/frontend/`)));
    app.use(bodyParser.json());


    // ----------------- http -----------------
    app.get('/attachments/:fileName', (req, res) => {
      this.strategy.getFileUrl(req.params.fileName, req.params.token).then((fileUrl) => {
        if (fileUrl[0] === '/') {
          res.sendFile(fileUrl, { dotfiles: 'deny', root: this.publicFilesDir });
        } else {
          res.redirect(fileUrl);
        }
      }).catch(() => {
        res.send(403, 'access denied');
      });
    });

    app.post('/attachments/', upload.single('attachment'), (req, res) => {
      this.strategy.storeFile(req.file, req.params.token).then((fileUrl) => {
        res.send({ attachmentUrl: fileUrl });
      }).catch(() => {
        res.send(403, 'access denied');
      });
    });

    app.post('/login/', (req, res) => {
      const { email, password } = req.body;
      this.strategy.authWithCredentials(email, password).then((authData) => {
        res.send({ userId: authData.userId, token: authData.token });
      }).catch(() => {
        res.send(403, 'access denied');
      });
    });


    // ----------- websockets utils -----------
    // const allClientsNotifier = {
    //   onNewEvent: (newEvent) => {
    //     this.sockets.forEach((socket) => {
    //       socket.emit('newEvent', newEvent);
    //     });
    //   },
    // };
    // this.eventStorage.addObserver(allClientsNotifier);


    // -------------- webSockets --------------
    io.on('connection', (socket) => {
      const { handshake: { query: { token } } } = socket;
      this.strategy.authWithToken('connection', token)
        .then(() => {
          this.configureSocket(socket, token);
          socket.emit('accessGranted');
        })
        .catch(() => {
          socket.emit('accessDenied');
          socket.disconnect();
        });
    });
  }

  stop() {
    this.server.close();
    this.server = null;
  }

  // private

  configureSocket(socket, token) {
    this.sockets[token] = socket;

    socket.on('disconnect', () => {
      this.sockets[token] = null;
    });

    socket.on('addEvent', (event, sendBack) => {
      this.strategy.processEvent(event, socket.handshake.query.token)
        .then((processedEvent, socketTokens) => (
          this.getSocketsForTokens(socketTokens).forEach(s => s.emit('newEvent', processedEvent))
        ))
        .catch(() => sendBack(permissionDeniedEvent(event)));
    });


    //   this.auth.allowEvent(event, socket.handshake.query.token)
    //   .then(() => {
    //     return this.incommingEventProcessors.processEvent(event);
    //   }).then(() => {
    //     sendBack(event);
    //     this.eventStorage.addEvent(event);
    //   })
    //   .catch(() => { sendBack(permissionDeniedEvent(event)); });
    // });

    socket.on('getAllPastEvents', (sendBack) => {
      this.strategy.allPastEvents(socket.handshake.query.token)
        .then(events => sendBack(events));

      // this.eventStorage.allPastEvents().then((events) => {
      //   sendBack(events);
      // });
    });
  }

  getSocketsForTokens(socketTokens) {
    return socketTokens.map(token => this.sockets[token]);
  }
}
