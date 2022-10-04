import GeneralNameSpace from "./generalSpace.class";
import {Namespace, Socket} from "socket.io";
import Game from "../game/game.class";
import {Subject} from "rxjs";

export default class ViewNameSpace extends GeneralNameSpace {

    constructor(namespace: Namespace, name: string, game: Game) {
        super(namespace,name, game);
        this.setupNameSpace();
    }

    setupNameSpace() {
        this.namespace.on('connect', (socket:Socket) => {

            socket.on('view:videoEnded', () => {
                this.game.initShowQuestion();
            });

            this.game.showAnswer.subscribe(res => {
                setTimeout(() => {
                    socket.emit('view:answer', res);
                }, 1000)
            });

            this.game.playPauseVideo.subscribe(() => {
                socket.emit('view:playState');
            });

            this.game.timerStopped.subscribe(() => {
                setTimeout(() => {
                   socket.emit('view:proof')
                }, 6000);
            });

            this.game.triggerAnimation.subscribe((res: {color: string, emoji: string}) => {
                socket.emit('view:animation', res);
            });
            this.game.showResults.subscribe(() => {
               socket.emit('view:showresults');
            });

            socket.on('view:getResults', ()=> {
                const results = this.game.getResults();
                socket.emit('view:getResults', results);
            });
        });
    }
};
