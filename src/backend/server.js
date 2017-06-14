/* eslint-disable no-multi-spaces */

import express from 'express';
import SocketIo from 'socket.io';
import multer from 'multer';
import bodyParser from 'body-parser';
import StoreFileUsecase from 'lib/store-file-usecase.js';
import CleanFilesUsecase from 'lib/clean-files-usecase.js';
import CurrentState from 'lib/current-state.js';
import AllowEveryoneAuth from 'lib/allow-everyone-auth.js';
import NullLogger from 'lib/null-logger.js';
import { hasToBeSet } from 'lib/utils.js';
import { permissionDeniedEvent } from 'lib/event-definitions.js';

export default class Server {
  constructor(params) {
    this.eventStorage = params.eventStorage || hasToBeSet('eventStorage');
    this.serverPort   = params.port         || 8081;
    this.uploadsDir   = params.uploadsDir   || '.tmp/tmpUploads/';
    this.logger       = params.logger       || new NullLogger();
    this.auth         = params.auth         || new AllowEveryoneAuth();
    this.noBanner     = params.noBanner     || false;

    this.server            = null;
    this.sockets           = [];
    this.currentState      = new CurrentState({ eventSource: this.eventStorage });
    this.storeFileUsecase  = new StoreFileUsecase(this.currentState, { storedFilesDir: this.uploadsDir });
    this.cleanFilesUsecase = new CleanFilesUsecase(this.currentState, {
      pathToStorage: this.uploadsDir,
      fileNamePrefix: '/attachments/'
    });
  }

  displayBanner() {
    // eslint-disable-next-line no-console
    console.log(`
    |
    | Starting Starboard...
    | ${this.eventStorage.welcomeInfo()}
    | ${this.auth.welcomeInfo()}
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

    app.use(express.static(`${__dirname}/frontend/`));
    app.use(bodyParser.json());


    // ----------------- http -----------------
    app.get('/attachments/:fileName', (req, res) => {
      res.sendFile(req.params.fileName, {
        dotfiles: 'deny',
        root: this.uploadsDir,
      });
    });

    app.post('/attachments/', upload.single('attachment'), (req, res) => {
      this.storeFileUsecase.addFile(req.file).then((fileName) => {
        res.send({ attachmentUrl: `/attachments/${fileName}` });
      });
    });

    app.post('/login/', (req, res) => {
      const email = req.body.email;
      const password = req.body.password;
      this.auth.grantAccessWithCredentials(email, password).then((authData) => {
        res.send({ userId: authData.userId, token: authData.token });
      }).catch(() => {
        res.send(403, 'access denied');
      });
    });


    // ----------- websockets utils -----------
    const allClientsNotifier = {
      onNewEvent: (newEvent) => {
        this.sockets.forEach((socket) => {
          socket.emit('newEvent', newEvent);
        });
      }
    };
    this.eventStorage.addObserver(allClientsNotifier);


    // -------------- webSockets --------------
    io.on('connection', (socket) => {
      this.auth.grantAccess(socket.handshake.query.token)
      .then(() => {
        this.configureSocket(socket);
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

  configureSocket(socket) {
    this.sockets.push(socket);
    socket.on('disconnect', () => {
      this.sockets.splice(this.sockets.indexOf(socket), 1);
    });

    socket.on('addEvent', (event, sendBack) => {
      this.auth.allowEvent(event, socket.handshake.query.token)
      .then(() => {
        this.cleanFilesUsecase.cleanWhenNeeded(event);
        sendBack(event);
        this.eventStorage.addEvent(event);
      })
      .catch(() => { sendBack(permissionDeniedEvent(event)); });
    });

    socket.on('getAllPastEvents', (sendBack) => {
      this.eventStorage.allPastEvents().then((events) => {
        sendBack(events);
      });
    });
  }
}
