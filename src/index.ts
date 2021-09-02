import express, { Request, Response } from 'express';
import morgan from 'morgan';
import ws from 'ws';
import http from 'http';
import socketIo from 'socket.io';

import router from './router/routes';
import control from './router/ws-control';

// Aplicación de express
const app = express();
// Middlewares
app.use(morgan('dev'));
// Server http
const server = new http.Server(app);
// Ws configuración
const webSocket = new ws.Server({ server, path:'/api/v1/ws' });

const io = new socketIo.Server(server, {
    cors: {
        origin: '*'
    },
    allowEIO3: true
});

control(io, webSocket);

app.use(router);

server.listen(3000, () => {
    console.log('server on port 3000');
});

export {
    webSocket,
    io
}