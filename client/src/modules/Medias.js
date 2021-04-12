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
}