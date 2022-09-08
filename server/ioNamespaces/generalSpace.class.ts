import { Namespace } from "socket.io";

export default class GeneralNameSpace {
    namespace: Namespace;
    name: string;
    
    constructor(nameSpace: Namespace, name: string){
        this.namespace = nameSpace;
        this.name = name;

        this.setUpListeningFunctions();
    }

    setUpListeningFunctions() {
        this.namespace.on("connection", (res) => {
            console.log("New " + this.name + " connected")
        });
    }
}