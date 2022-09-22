import GeneralNameSpace from "./generalSpace.class";
import { Namespace, Socket } from "socket.io";
import Game from "../game/game.class";
import fs from "fs";


export default class AdminNameSpace extends GeneralNameSpace {
    key?: string;

    constructor(namespace: Namespace, name: string, game: Game) {
        super(namespace,name, game);
        fs.readFile('server/key.json', (err, data) => {
           if (err) throw(err);
           //@ts-ignore
           data = JSON.parse(data);
           //@ts-ignore
           this.key = data.admin;
        });
        this.setupNamespace();
    }
    setupNamespace() {
       this.namespace.on('connect', (socket:Socket) => {
        socket.on('login', data => {
            data = data.payload;
            if (data.password === this.key) {
                socket.emit('connection:success', {key: this.game.config.key});
                this.emitCurrentQuestion(socket);
            }else {
                socket.emit('registration:failure');
            }
        });

        socket.on('admin:switchQuestion', data => {
            data = data.payload;
            if (!data.direction) return;
            this.game.switchQuestionTo(data.direction);
        });

        socket.on('admin:toggleVisibility', () => {
            this.game.toggleQuestionVisibility();
        });

       });
    }

    isAllowed(data): boolean{
        return true;
    }
    
}
