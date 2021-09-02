import express from 'express';
import morgan from 'morgan';
import ws from 'ws';
import http from 'http';
import socketIo from 'socket.io';

// Aplicación de express
const app = express();
// Middlewares
app.use(morgan('dev'));
// Server http para socket.io
const server = new http.Server(app);
const webSocket = new ws.Server({ noServer: true });
const io = new socketIo.Server(server, {
    cors: {
        origin: '*'
    },
    allowEIO3: true
});

io.on('connection', socket => {
    console.log(socket.id);
    socket.on('message', data => {
        console.log(data);
        socket.emit('data', { message: 'recivido', name: data.name });
    });
})

webSocket.on('connection', socket => {
    socket.on('message', (results: any) => {
        const data = JSON.parse(results.toString());
        console.log(data);
    })
})

server.listen(3000, () => {
    console.log('server on port 3000');
}).on('upgrade', (request: http.IncomingMessage, socket: any, head: Buffer): void => {
    const pathname = request.url;
    if (pathname === '/api/v1/ws') {
        webSocket.handleUpgrade(request, socket, head, socket => {
            socket.setMaxListeners(500);
            webSocket.emit('connection', socket, request);
        });
    } else {
        socket.destroy();
    }
});