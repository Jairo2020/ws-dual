import { DefaultEventsMap } from "socket.io/dist/typed-events";
import socketIo from 'socket.io';
import ws from 'ws';

const control = (ws: socketIo.Server<DefaultEventsMap>, websocket:ws.Server) => {
    
    ws.of('/connect').on('connection', (socket: { id: any; }) => {
        console.log(socket.id);
    });
    ws.on('connection', (socket) => {
        console.log(socket.id);
        socket.on('message', data => {
            console.log(data);
            socket.emit('data', { message: 'recivido', name: data.name });
        });
    });

    websocket.on('connection', (socket, req) => {
        socket.on('message', (results: any) => {
            const data = JSON.parse(results.toString());
            console.log(data);
            socket.emit('data', { message: 'recivido', name: data.age });
        });
    });

};

export = control;