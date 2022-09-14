import GeneralNameSpace from "./generalSpace.class";
import { Namespace, Socket } from "socket.io";
import Game from "../game/game.class";


export default class AdminNameSpace extends GeneralNameSpace {

    constructor(namespace: Namespace, name: string, game: Game) {
        super(namespace,name, game);
        this.setupNamespace();
    }
    setupNamespace() {
       this.namespace.on('connect', (socket:Socket) => {
        socket.on('login', data => {
            
        });
       });
    }

    isAllowed(data): boolean{
        return true;
    }
    
}