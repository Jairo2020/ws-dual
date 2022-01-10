import { Socket } from "socket.io";
import index from '../../index';

// this.io.to(this.id).emit('data',{message:"hola desde el request"}); //Enviar a un id específico

export function connectionSocket(socket: Socket) {
    // socket.emit('message', { message: 'recivido', id: socket.id });
    index.io.emit('data', 'Hola desde el router')
    socket.on('message', (data) => {
        socket.emit('data', { message: 'recivido', name: data.name, id: socket.id });
    });

    socket.on('send-message', data => {
        socket.emit('data', { message: 'recivido', name: data.name, id: socket.id });
    });
    socket.on('data', (data) => {
        socket.emit('data', { message: 'recivido', name: data.name, id: socket.id });
    });
}
