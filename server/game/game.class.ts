import Team from "./team.class"
import fs from "fs";
import { Socket } from "socket.io";

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

export default class Game {
    config;
    questions;
    gameState: gameState;
    answers: answer[][];
    clock;

    constructor(){
        console.log('Setting up the Game backend');
        
        fs.readFile('game.config.json', (err, data) => {
            if (err) throw err;
            // @ts-ignore
            this.config = JSON.parse(data);
            console.log('Game config loaded, loading questions' + '\n');
            this.loadQuestions(this.config.gameFiles);
        });
    }

    loadQuestions(path: string) {
        fs.readFile(path, (err, data) => {
            if (err) throw err;
            //@ts-ignore
            const rawQuestions = JSON.parse(data);
           
            this.questions = rawQuestions.questions.map((question, index) => {
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
        color: string)
        {
            const id = this.gameState.players.length;
            this.gameState.players.push(new Team(name, socket,  emoji, color, id));
        }
    
    getTeamById(id:number): Team | undefined{
        const teamToGet = this.gameState.players.find(elem => elem.id === id);
        return teamToGet;
    }

    getTeamBySocketId(id: string): Team | undefined {
        const teamToGet = this.gameState.players.find(elem => elem.socket.id === id);
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
        console.log('QuestionTick ' + newTick + "/n");
        
        if (newTick >= 0){
            this.stopTimer();
        }
    }

    toggleQuestionVisibility(shouldBeVisible?: boolean){
        this.gameState.questionState.questionShown = shouldBeVisible ? shouldBeVisible : !this.gameState.questionState.questionShown;
    }

    giveAnswer(socketId: string, answer: string): boolean{
        const currentQuestion = this.gameState.questionState.currentQuestion;
        if(!this.gameState.questionState.questionShown) return false;
        if(this.answers[currentQuestion].find(element => element.socketId === socketId)) return false;
        if(this.gameState.questionState.currentTimer >= 0) return false;

        this.answers[currentQuestion].push(
            {
                questionId: currentQuestion,
                answer,
                correct: false,
                time: this.gameState.questionState.currentTimer,
                socketId
        }
        );
        return true;
    }
}