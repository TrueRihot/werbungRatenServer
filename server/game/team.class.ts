import { Socket } from "socket.io";

import Game from "./game.class";

export default class Team {
    name: string;
    socket: Socket;
    emoji: string;
    color: string;
    id: number;
    password: string;

    game: Game;

    constructor(
        name: string,
        socket: Socket,
        emoji: string,
        color: string,
        id: number,
        password: string) {
        this.name = name;
        this.socket = socket;
        this.emoji = emoji;
        this.color = color;
        this.id = id
        this.password = password;
    }

    updateSocket(newSocket: Socket) {
        this.socket = newSocket;
    }

}
