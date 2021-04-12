import {IO} from "./IO";

export class WebRTC {

    get peerConnectionConfig() {
        return {
            'iceServers': [
                {'urls': 'stun:stun.services.mozilla.com'},
                {'urls': 'stun:stun.l.google.com:19302'},
            ]
        }
    }

    constructor(stream) {
        console.log('My stream ', stream)
        this.stream = stream
        this.clients = []
        this.io = new IO()
    }

    init() {
        this.io.connect(() => {
            this.io.socket.on('init', this.onInit.bind(this))
            this.io.socket.on('client-join', this.onClientJoin.bind(this))
            this.io.socket.on('receive-offer', this.onReceiveOffer.bind(this))
            this.io.socket.on('receive-answer', this.onReceiveAnswer.bind(this))
            this.io.socket.on('receive-candidate', this.onReceiveCandidate.bind(this))
        })
    }

    onInit({clientsIds}) {
        clientsIds.forEach(clientId => this.createPeerConnection(clientId))
    }

    async onClientJoin({clientId}) {
        this.createPeerConnection(clientId)
        const description = await this.clients[clientId].createOffer()
        await this.clients[clientId].setLocalDescription(description)
        this.io.socket.emit('send-offer', this.clients[clientId].localDescription);
    }

    createPeerConnection(clientId) {
        this.clients[clientId] = new RTCPeerConnection(this.peerConnectionConfig);
        this.clients[clientId].onicecandidate = e => {
            if (e.candidate != null) {
                this.io.socket.emit('send-candidate', {
                    toClientId: clientId,
                    candidate: e.candidate
                });
            }
        }
        this.clients[clientId].onaddstream = (e) => {
            console.log('Remote stream', e.stream)
        }
        this.clients[clientId].addStream(this.stream);
    }

    async onReceiveOffer({fromClientId, description}) {
        const isMe = fromClientId === this.io.socket.id
        if (isMe) return

        await this.clients[fromClientId].setRemoteDescription(description)
        const answerDescription = await this.clients[fromClientId].createAnswer()
        this.io.socket.emit('send-answer', {
            toClientId: fromClientId,
            description: answerDescription
        });
    }

    async onReceiveAnswer({fromClientId, description}) {
        await this.clients[fromClientId].setRemoteDescription(description)
    }

    async onReceiveCandidate({fromClientId, candidate}) {
        await this.clients[fromClientId].addIceCandidate(candidate)
    }
}