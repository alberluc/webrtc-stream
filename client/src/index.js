import './index.css'
import {Medias} from "./modules/Medias";
import {WebRTC} from "./modules/WebRTC";

const start = async () => {
    const stream = await Medias.getLocalStream();

    const localVideo = document.getElementById('local-video')
    localVideo.srcObject = stream

    const webrtc = new WebRTC(stream)
    webrtc.init()
}

start()



