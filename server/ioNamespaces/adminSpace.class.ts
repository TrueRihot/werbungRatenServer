import GeneralNameSpace from "./generalSpace.class";
import { Namespace, Socket } from "socket.io";
import Game from "../game/game.class";
import fs from "fs";
import Team from "../game/team.class";


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
                this.emitTeams(socket);
            }else {
                socket.emit('registration:failure');
            }
        });

        socket.on('admin:switchQuestion', data => {
            data = data.payload;
            if (!data.direction) return;
            this.game.switchQuestionTo(data.direction);
        });

        socket.on('admin:switchAnswer', data => {
           data = data.payload;
           this.game.changeAnswer(data);
           this.emitCurrentQuestion(socket);
        });

        socket.on('admin:toggleVisibility', () => {
            this.game.toggleQuestionVisibility();
        });

        socket.on('admin:playPause', () => {
           this.game.playPauseVideo.next('playPause');
        });

        socket.on('admin:save', () => {
            this.game.save();
        });

        this.game.newAnswer.subscribe(() => {
           this.emitCurrentQuestion(socket);
        });

        this.game.newTeam.subscribe(() => {
           this.emitTeams(socket);
        });

       });
    }

    isAllowed(data): boolean{
        return true;
    }

    private emitTeams(socket: Socket) {
        const teamsArray = [];
        const buildTeam = (team: Team) => {
            teamsArray.push({
                name: team.name,
                socketId: team.socket.id,
                emoji: team.emoji,
                color: team.color,
                id: team.id
            })
        };
        this.game.gameState.players.forEach(buildTeam)
        socket.emit('admin:teams', teamsArray)
    }
}
