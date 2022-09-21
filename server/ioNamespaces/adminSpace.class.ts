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
