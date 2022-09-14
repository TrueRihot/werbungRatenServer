import GeneralNameSpace from "./generalSpace.class";
import { Namespace } from "socket.io";
import Game from "../game/game.class";

export default class ViewNameSpace extends GeneralNameSpace {
    constructor(namespace: Namespace, name: string, game: Game) {
        super(namespace,name, game);
    }
};