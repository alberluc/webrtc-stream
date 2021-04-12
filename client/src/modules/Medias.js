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

    static createVideoElement({containerId, stream, id = null}) {
        const container = document.getElementById(containerId)
        const video = document.createElement('video')
        if (id) {
            video.setAttribute('data-id', id)
        }
        video.autoplay = true
        video.muted = false
        video.playsinline = true
        video.controls = true
        video.srcObject = stream
        video.classList.add(`video-${containerId}`)
        container.appendChild(video)
    }

    static removeVideoElement(id) {
        const video = document.querySelector(`[data-id="${id}"]`)
        video.parentElement.removeChild(video)
    }
}