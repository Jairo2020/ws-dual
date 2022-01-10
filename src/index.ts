import Server from './settings/server';

const server = new Server();

server.Start();

export default {
    io: server.io,
    ws: server.ws
};