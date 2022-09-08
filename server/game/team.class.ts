import { Socket } from "socket.io";

import Game from "./game.class";

export default class Team {
    name: string;
    socket: Socket;
    emoji: string;
    color: string;
    id: number;

    game: Game;

    constructor(
        name: string,
        socket: Socket,
        emoji: string,
        color: string,
        id: number) {
        this.name = name;
        this.socket = socket;
        this.emoji = emoji;
        this.color = color;
        this.id = id
    }

    updateSocket(newSocket: Socket) {
        this.socket = newSocket;
    }

}