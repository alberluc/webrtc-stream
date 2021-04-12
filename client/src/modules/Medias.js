export class Medias {

    /**
     * Get the local stream of the client
     * @return {Promise<MediaStream>}
     */
    static async getLocalStream() {
        return await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
        })
    }

    static getVideoElement({id, stream}) {
        const video = document.createElement('video')

        if (id) {
            video.setAttribute('data-id', id)
        }
        video.autoplay = true
        video.muted = true
        video.playsinline = true
        video.controls = true
        video.srcObject = stream

        return video
    }

    static removeVideoElement(id) {
        const video = document.querySelector(`[data-id="${id}"]`)
        video.parentElement.removeChild(video)
    }

    static createVideoElement(param) {
        const container = document.getElementById('videos')
        const video = Medias.getVideoElement(param)
        container.appendChild(video)
    }
}