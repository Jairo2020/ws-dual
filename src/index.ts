import express from 'express';
import morgan from 'morgan';
import ws from 'ws';
import http from 'http';
import socketIo from 'socket.io';

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

io.on('connection', socket => {
    console.log(socket.id);
    socket.on('message', data => {
        console.log(data);
        socket.emit('data', { message: 'recivido', name: data.name });
    });
});

webSocket.on('connection', (socket, req) => {
    socket.on('message', (results: any) => {
        const data = JSON.parse(results.toString());
        console.log(data);
        socket.emit('data', { message: 'recivido', name: data.age });
    });
});

server.listen(3000, () => {
    console.log('server on port 3000');
});