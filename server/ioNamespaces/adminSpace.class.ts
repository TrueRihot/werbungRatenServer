import GeneralNameSpace from "./generalSpace.class";
import { Namespace } from "socket.io";


export default class AdminNameSpace extends GeneralNameSpace {

    constructor(namespace: Namespace, name: string) {
        super(namespace,name);
    }
}