//#region imports npm
import express, { Application, json, NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import { WebSocketServer } from 'ws';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import socketIo from 'socket.io';
import http from 'http';

//#endregion
//#region router controller
import { connectionSocket } from '../controllers/websocket/socketIo.controller';
import { connectionWs, socketWs } from '../controllers/websocket/ws.controller';
//#endregion
export default class Server {
    app: Application;
    private urlDefault: string = '/api/v1/';
    public io: socketIo.Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>;
    public ws: WebSocketServer;
    server: http.Server;

    constructor() {
        this.app = express();
        this.Config();
        this.server = new http.Server(this.app);
        this.ws = new WebSocketServer({ server: this.server, path: this.urlDefault + 'ws' });
        this.io = new socketIo.Server(this.server, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            },
            allowEIO3: true,
            transports: ['polling', 'websocket'],
            pingInterval: 25 * 1000,
            pingTimeout: 5000,
            maxHttpBufferSize: 100000000,
            connectTimeout: 5000,
            path: this.urlDefault + 'socket.io',

        });
        this.Routes();
    }

    private Config() {
        this.app.set('port', process.env.PORT || 3000);
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(morgan('dev'));
        this.app.use((req: Request, res: Response, next: NextFunction) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
            res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
            res.header('Allow', 'GET, POST, PUT, DELETE');
            next();
        });
    }

    private Routes() {
        this.io.on('connection', connectionSocket);
        this.ws.on('connection', connectionWs);

        this.app.get('/', (req: Request, res: Response) => {
            const message = { index: "hola desde el index de la API" };
            this.io.emit('message', message);
            socketWs.send(JSON.stringify(message));
            res.status(200).send('index api');
        });
    }

    public Start() {
        this.server.listen(this.app.get('port'));
    }
}