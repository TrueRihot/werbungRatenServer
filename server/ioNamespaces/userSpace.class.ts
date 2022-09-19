import GeneralNameSpace from "./generalSpace.class";
import { Namespace } from "socket.io";
import Game from "../game/game.class";

interface emoji {
    emoji: string,
    used: boolean
  }

export default class UserNameSpace extends GeneralNameSpace {

    emojiList: emoji[] = [
        {emoji: '😇', used: false},
        {emoji: '🥳', used: false},
        {emoji: '🕶', used: false},
        {emoji: '🐸', used: false},
        {emoji: '🐲', used: false},
        {emoji: '⚡️', used: false},
        {emoji: '🍉', used: false},
        {emoji: '🥦', used: false},
        {emoji: '⚽️', used: false},
        {emoji: '🏎', used: false},
        {emoji: '💎', used: false},
        {emoji: '🐧', used: false}
    ];

    constructor(namespace: Namespace, name: string, game: Game) {
        super(namespace,name, game);
        this.setupNamespace();
    }
    setupNamespace(){
        this.namespace.on("connection", (socket: any) => {
            /* is auth is just there to see if the user has been logged in on disconnect */
            let isAuth = false;
            let pickedEmoji: string;


            /**
             * EmojiList update
             */
            socket.emit("emoji:pick", this.emojiList);

            /**
             * Login Fnc to validate regisrations of players
             *
             */
            socket.on('login', (data) => {
                data = data.payload;
                const registration = this.game.registerTeam(data.name, socket, data.emoji, data.color);
                if(registration !== 'success'){
                    socket.emit('registration:failure', registration);
                }
                else{
                    socket.emit('registration:success', {key: this.game.config.key});
                    console.log('Teamregistration successfull');
                }
            });


            /**
             * fnc if Emojis get picked so the view get's a constant update of all avaliable emojis
             */
            socket.on("emoji:pick", (data)=> {
                data = data.payload;     
                let itemsToUpdate: emoji[] = [];

                const item = this.emojiList.find(el => el.emoji === data.next.emoji);
                itemsToUpdate.push(item);
                pickedEmoji = item.emoji;

                if (data.prev) {
                    const itemPrev = this.emojiList.find(el => el.emoji === data.prev.emoji);
                    itemsToUpdate.push(itemPrev);
                }
                
                if(itemsToUpdate.length > 0) {
                    this.updateEmojiList(itemsToUpdate);
                }
            });


            /*
                Disconnect function!!!
            */
           socket.on('disconnect', () => {
                if(!isAuth)
                this.updateEmojiList([this.emojiList.find(el => el.emoji === pickedEmoji)])
            });
        });
    }

    updateEmojiList(items: emoji[]) {
        items.forEach(item => {
            const index = this.emojiList.indexOf(item);
            if (index === -1) return;
            this.emojiList[index].used = !this.emojiList[index].used;
        })
        this.namespace.emit("emoji:pick", this.emojiList);
    }
}
