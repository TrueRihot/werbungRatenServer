import { Namespace, Server } from "socket.io";
import {Server as HttpServer} from "http";
import UserNameSpace from "./ioNamespaces/userSpace.class";
import AdminNameSpace from "./ioNamespaces/adminSpace.class";
import ViewNameSpace from "./ioNamespaces/viewSpace.class";
import {ServerInstance} from "../index";
import Game from "./game/game.class";

export class IoHandlerClass {
    server: HttpServer;
    game: Game;
    io: Server;
    user: any;
    admin: any;
    view: any;
    constructor(server) {
        this.game = ServerInstance.game;
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
        this.user = new UserNameSpace(this.io.of("/user"), 'user', this.game);
        this.admin = new AdminNameSpace(this.io.of("/admin"), 'admin', this.game);
        this.view = new ViewNameSpace(this.io.of("/view"), 'view', this.game);
        this.io.on('connect', socket => {
            socket.emit('hey')
        });
        console.log('Io handlers established' + '\n');
    }
}
