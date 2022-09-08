import {createServer, Server} from "http";
import fs from "fs";
import express, {Express} from "express";
import cors from 'cors';
import path from "path";
import {IoHandlerClass} from "./ioHandler.class";

import Game from "./game/game.class";

export default class WerbungServer {
    config = undefined;
    app:Express = undefined;
    server:Server = undefined;
    io: IoHandlerClass = undefined;

    public game: Game;

    constructor() {
        console.log('Loading Config');
        // Loading The Server Config
        fs.readFile('server.config.json', (err, data) => {
            if (err) throw err;
            // @ts-ignore
            this.config = JSON.parse(data);

            console.log('Config Loaded' + '\n');

            this.setupGameBackend();
            this.bootServer();
        });
    }

    setupGameBackend() {
        this.game = new Game();
    }

    bootServer() {
        console.log('Booting Server')
        this.app = express();
        this.app.use(cors({
            origin: "*"
        }));
        this.app.use(express.json());
        this.app.use('/server', express.static('server'));
        this.server = createServer(this.app);

        this.io = new IoHandlerClass(this.server);

        this.app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, '/werbung-raten-ui', 'index.html'));
        });

        this.server.listen(this.config.port, () => {
            console.log(`Server up and running! Listening on  http://localhost:${this.config.port}` + '\n');
        });
    }
}
