import Team from "./team.class"
import fs from "fs";
import { Socket } from "socket.io";
import EventEmitter from "events";
import {NodeCompatibleEventEmitter} from "rxjs/internal/observable/fromEvent";
import {Subject} from "rxjs";

export interface gameState {
        players: Team[],
        admins: any[],
        views: any[],
        questionState: {
            currentQuestion: number,
            questionShown: boolean,
            currentTimer: number
        }
};

export interface answer{
    questionId: number,
    answer: string,
    time: number,
    correct: boolean,
    socketId: string
};

export interface question {
    question: string,
    answer: string,
    videoPath: string,
    proof:
        {
            type: 'picture' | 'video',
            path : string,
            timeStamp: number[]
        }
}

export default class Game {
    config;
    questions: question[] = [];
    gameState: gameState;
    answers: answer[][] = [];

    private clock;
    public clockEmitter: Subject<number> = new Subject<number>();
    public newAnswer: Subject<any> = new Subject<any>();
    public questionChanged: Subject<
        {
        currentQuestion: number,
        questionShown: boolean,
        currentTimer: number
        }
    > = new Subject();
    public newTeam: Subject<Team> = new Subject<Team>();

    constructor(){
        console.log('Setting up the Game backend');
        
        fs.readFile('game.config.json', (err, data) => {
            if (err) throw err;
            // @ts-ignore
            this.config = JSON.parse(data);
            console.log('Game config loaded, loading questions' + '\n');
            this.setupGameState();
            this.loadQuestions(this.config.gameFiles);
        });
    }

    loadQuestions(path: string) {
        fs.readFile(path, (err, data) => {
            if (err) throw err;
            //@ts-ignore
            const rawQuestions = JSON.parse(data);
           
            this.questions = rawQuestions.questions.map((question, index) => {
                this.answers.push([]);
                return {...question , id: index, answers: []};
            });
            console.log('Questions loaded successfully' + '\n');       
        });
    }

    setupGameState() {
        this.gameState = {
            players: [],
            admins: [],
            views: [],
            questionState: {
                currentQuestion: 0,
                questionShown: false,
                currentTimer: this.config.timer
            }
        }
    }

    registerTeam(
        name: string,
        socket: Socket,
        emoji: string,
        color: string): 'success' | 'falseteamname'
        {
            if(this.getTeamByName(name)) return 'falseteamname';
            const id = this.gameState.players.length;
            const newTeamInstance = new Team(name, socket,  emoji, color, id)
            this.gameState.players.push(newTeamInstance);
            this.newTeam.next(newTeamInstance);
            return "success";
        }
    
    getTeamById(id:number): Team | undefined{
        const teamToGet = this.gameState.players.find(elem => elem.id === id);
        return teamToGet;
    }

    getTeamBySocketId(id: string): Team | undefined {
        const teamToGet = this.gameState.players.find(elem => elem.socket.id === id);
        return teamToGet;
    }

    getTeamByName(name: string): Team | undefined{
        const teamToGet = this.gameState.players.find(elem => elem.name === name);
        return teamToGet;
    }
    
    startTimer(){
        if(this.clock) return;
        this.clock = setInterval(this.tick, 1000);
    }

    resetTimer(){
        this.stopTimer();
        this.gameState.questionState.currentTimer = this.config.timer;
    }

    stopTimer(){
        if (!this.clock) return;
        clearInterval(this.clock);
        this.clock = undefined;
    }

    tick() {
        const newTick = this.gameState.questionState.currentTimer -1;
        this.gameState.questionState.currentTimer = newTick;
        console.log('QuestionTick ' + newTick + "/n");
        this.clockEmitter.next(newTick);

        if (newTick >= 0){
            this.stopTimer();
        }
    }

    switchQuestionTo(val: 'next' | 'prev') {
        const current = this.gameState.questionState.currentQuestion;
        let next;
        switch (val) {
            case 'next':
                next = this.gameState.questionState.currentQuestion++;
                break;
            case "prev":
                next = this.gameState.questionState.currentQuestion--;
                break;
            default:
                break;
        }
        next = this.clampValidQuestion(next);
        this.gameState.questionState.currentQuestion = next !== current ? next : current;
        if (next !== current) {
            this.gameState.questionState.questionShown = false;
        }
        this.questionChanged.next(this.gameState.questionState);
    }

    clampValidQuestion(num) {
        return num <= 0
            ? 0
            : num >= this.questions.length - 1
                ? this.questions.length - 1
                : num
    }

    toggleQuestionVisibility(shouldBeVisible?: boolean){
        this.gameState.questionState.questionShown = shouldBeVisible ? shouldBeVisible : !this.gameState.questionState.questionShown;
        this.questionChanged.next(this.gameState.questionState);
    }

    giveAnswer(socketId: string, answer: string): boolean{
        const currentQuestion = this.gameState.questionState.currentQuestion;
        if(!this.gameState.questionState.questionShown) return false;
        if(this.answers[currentQuestion].find(element => element.socketId === socketId)) return false;
        if(this.gameState.questionState.currentTimer <= 0) return false;

        this.answers[currentQuestion].push(
            {
                questionId: currentQuestion,
                answer,
                correct: false,
                time: this.gameState.questionState.currentTimer,
                socketId
        }
        );
        this.newAnswer.next('new Answer');
        return true;
    }

    getCurrentQuestion() {
        return this.questions[this.gameState.questionState.currentQuestion];
    }
}
