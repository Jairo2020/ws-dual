import http from 'http';
import ws from 'ws';
var socketWs: ws;
const connectionWs = (websocket: ws, req: http.IncomingMessage) => {
    websocket.on('message', (results: any) => {
        const data = JSON.parse(results.toString());
        console.log(data);
        websocket.send(JSON.stringify(data));
    });
    websocket.on('data', (results: any) => {
        const data = JSON.parse(results.toString());
        console.log('message', data);
    });
    socketWs = websocket;
}
export {
    connectionWs,
    socketWs
};
