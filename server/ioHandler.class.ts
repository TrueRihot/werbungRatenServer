import { Server } from "socket.io";
import {Server as HttpServer} from "http";

export class IoHandlerClass {
    server: HttpServer;
    io: Server;
    constructor(server) {
        this.server = server;
        this.bootIoServer();
    }

    bootIoServer() {
        this.io = new Server(this.server,{
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });

        this.io.on('connection', (socket) => {
            socket.emit('user:connected');
        })
    }
}
