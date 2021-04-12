import {io} from "socket.io-client";

export class IO {

    constructor() {
        this.socket = io('http://localhost:3000', {
            autoConnect: false
        });
    }

    connect(callback) {
        this.socket.on('connect', callback)
        this.socket.connect()
    }
}