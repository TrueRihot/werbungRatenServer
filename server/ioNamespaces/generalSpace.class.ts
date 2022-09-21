import {Namespace, Socket} from "socket.io";
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
        this.namespace.on("connection", (socket) => {
            console.log("New " + this.name + " connected")

            this.emitCurrentQuestion(socket);

            this.game.clockEmitter.subscribe(res => {
                socket.emit('tick', res);
            });

            this.game.questionChanged.subscribe(res => {
                this.emitCurrentQuestion(socket);
            });
        });
    }

    emitCurrentQuestion(socket: Socket) {
        let fullQuestionData = {...this.game.gameState.questionState, question: this.game.getCurrentQuestion()};
        socket.emit('questionChanged', fullQuestionData);
    }
}
