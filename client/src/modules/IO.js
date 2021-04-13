import {io} from "socket.io-client";

export class IO {

    constructor() {
        const isDev = false
        const url = isDev ? 'http://localhost:3000' : 'https://server-webrtc.lucienalbert.fr'
        this.socket = io(url, {
            autoConnect: false
        });
    }

    connect(callback) {
        this.socket.on('connect', callback)
        this.socket.connect()
    }
}