class BlobAnalyzer {
    
    static _fileTypes = ["image", "video", "audio"];

    static determineType (blob) {

        let fileType = "undefined";

        this._fileTypes.forEach(function(type){
            if(blob.type.includes(type)){
                fileType = type;
            }
        });

        return fileType;

    }

    static hasAudio (video) {
        return video.mozHasAudio ||
        Boolean(video.webkitAudioDecodedByteCount) ||
        Boolean(video.audioTracks && video.audioTracks.length);
    }

};

export default BlobAnalyzer;