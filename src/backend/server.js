/* eslint-disable no-multi-spaces */

import path from 'path';
import express from 'express';
import SocketIo from 'socket.io';
import multer from 'multer';
import bodyParser from 'body-parser';
import NullLogger from 'lib/null-logger';
import { hasToBeSet } from 'lib/utils';
import { permissionDeniedEvent } from 'lib/event-definitions';

export default class Server {
  constructor(params) {
    this.serverPort      = params.port            || 9000;
    this.logger          = params.logger          || new NullLogger();
    this.noBanner        = params.noBanner        || false;
    this.strategy        = params.strategy        || hasToBeSet('strategy');
    this.uploadsTmpDir   = path.resolve(params.uploadsTmpDir  || '.tmp/tmpUploads/');
    this.publicFilesDir  = path.resolve(params.publicFilesDir || '.tmp/public/');
    this.server          = null;
    this.sockets         = [];

    this.strategy.onNewAsyncEvent(event => this.broadcastEvent(event));
  }

  displayBanner() {
    // eslint-disable-next-line no-console
    console.log(`
    |
    | Starting Starboard...
    | ${this.strategy.info().replace(/\n/g, '\n    | ')}
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
    const upload = multer({ dest: this.uploadsTmpDir });

    this.server = server;

    app.use(express.static(path.resolve(`${__dirname}/frontend/`)));
    app.use(bodyParser.json());


    // ----------------- http -----------------
    app.get('/attachments/:fileName', (req, res) => {
      this.strategy.getFileUrl(req.params.fileName, req.params.token).then((fileUrl) => {
        if (fileUrl[0] === '/') {
          const relatveToRoot = fileUrl.replace(this.publicFilesDir, '');
          res.sendFile(relatveToRoot, { dotfiles: 'deny', root: this.publicFilesDir });
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

    // -------------- webSockets --------------
    io.on('connection', (socket) => {
      const { handshake: { query: { token } } } = socket;
      this.strategy.authWithToken(token)
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

  broadcastEvent(event) {
    this.sockets.forEach(s => s.emit('newEvent', event));
  }

  configureSocket(socket) {
    this.sockets.push(socket);

    socket.on('disconnect', () => {
      this.sockets.splice(this.sockets.indexOf(socket), 1);
    });

    socket.on('addEvent', (event, sendBack) => {
      const { handshake: { query: { token } } } = socket;
      this.strategy.processEvent(event, token)
        .catch(() => sendBack(permissionDeniedEvent(event)));
    });

    socket.on('getAllPastEvents', (sendBack) => {
      const { handshake: { query: { token } } } = socket;
      this.strategy.allPastEvents(token).then(events => sendBack(events));
    });
  }
}
