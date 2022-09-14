import GeneralNameSpace from "./generalSpace.class";
import { Namespace } from "socket.io";
import { Socket } from "dgram";
import Game from "../game/game.class";

export default class UserNameSpace extends GeneralNameSpace {

    constructor(namespace: Namespace, name: string, game: Game) {
        super(namespace,name, game);
        this.setupNamespace();
    }
    setupNamespace(){
        this.namespace.on("connection", (socket: any) => {

            socket.on('login', (data) => {
                const registration = this.game.registerTeam(data.name, socket, data.emoji, data.color);
                if(registration === 'failure'){
                    socket.emit('registration:failure');
                }
                else{
                    socket.emit('registration:success');
                    console.log('Teamregistration successfull');
                    
                }
            });


        });
    }
}