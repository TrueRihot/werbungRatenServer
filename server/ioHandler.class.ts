import { Namespace, Server } from "socket.io";
import {Server as HttpServer} from "http";
import UserNameSpace from "./ioNamespaces/userSpace.class";
import AdminNameSpace from "./ioNamespaces/adminSpace.class";
import ViewNameSpace from "./ioNamespaces/viewSpace.class";

export class IoHandlerClass {
    server: HttpServer;
    io: Server;
    user: any;
    admin: any;
    view: any;
    constructor(server) {
        this.server = server;
        this.bootIoServer();
    }

    bootIoServer() {
        console.log("Seeting up Websocket Connection");

        this.io = new Server(this.server,{
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });

        this.io.on('login', socket => {
            console.log('test')
        });


        this.user = new UserNameSpace(this.io.of("/user"), 'user');
        this.admin = new AdminNameSpace(this.io.of("/admin"), 'admin');
        this.view = new ViewNameSpace(this.io.of("/view"), 'view');


        this.io.on("connection", socket => {
            console.log('connection')
        });
        console.log('Io handlers established' + '\n');
    }
}
