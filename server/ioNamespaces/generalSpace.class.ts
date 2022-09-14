import { Namespace } from "socket.io";
import Game from "../game/game.class";

export default class GeneralNameSpace {
    namespace: Namespace;
    name: string;
    game: Game;
    
    constructor(nameSpace: Namespace, name: string, game: Game){
        this.namespace = nameSpace;
        this.name = name;
        this.game = game;

        this.setUpListeningFunctions();
    }

    setUpListeningFunctions() {
        this.namespace.on("connection", (res) => {
            console.log("New " + this.name + " connected")
        });
    }
}