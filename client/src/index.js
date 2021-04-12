import './index.css'
import {Medias} from "./modules/Medias";
import {WebRTC} from "./modules/WebRTC";

/**
 * Start the application
 * @return {Promise<void>}
 */
const start = async () => {
    const stream = await Medias.getLocalStream();
    Medias.createVideoElement({
        stream,
        containerId: 'me'
    });

    const webrtc = new WebRTC(stream)
    webrtc.onAddStream = (id, stream) => {
        Medias.createVideoElement({
            id,
            stream,
            containerId: 'remote'
        });
    }
    webrtc.onRemoveStream = id => {
        Medias.removeVideoElement(id)
    }

    webrtc.init()
}

start()



