import {IO} from "./IO";

export class WebRTC {

    get peerConnectionConfig() {
        return {
            iceServers: [
                {urls: 'stun:stun.l.google.com:19302'},
            ]
        }
    }

    constructor(stream) {
        this.stream = stream
        this.clients = []
        this.io = new IO()
    }

    init() {
        this.io.connect(() => {
            this.io.socket.on('init', this.onInit.bind(this))
            this.io.socket.on('client-join', this.onClientJoin.bind(this))
            this.io.socket.on('client-disconnect', this.onClientDisconnect.bind(this))
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
        this.io.socket.emit('send-offer', {
            toClientId: clientId,
            offer: this.clients[clientId].localDescription
        });
    }

    onClientDisconnect({clientId}) {
        if (this.onRemoveStream) {
            this.onRemoveStream(clientId)
        }
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
            if (this.onAddStream) {
                this.onAddStream(clientId, e.stream)
            }
        }
        this.clients[clientId].addStream(this.stream);
    }

    async onReceiveOffer({fromClientId, offer}) {
        const isMe = fromClientId === this.io.socket.id
        if (isMe) return

        await this.clients[fromClientId].setRemoteDescription(offer)
        const answer = await this.clients[fromClientId].createAnswer()
        await this.clients[fromClientId].setLocalDescription(new RTCSessionDescription(answer));
        this.io.socket.emit('send-answer', {
            toClientId: fromClientId,
            answer
        });
    }

    async onReceiveAnswer({fromClientId, answer}) {
        await this.clients[fromClientId].setRemoteDescription(
            new RTCSessionDescription(answer)
        )
    }

    async onReceiveCandidate({fromClientId, candidate}) {
        await this.clients[fromClientId].addIceCandidate(candidate)
    }
}