class Media { 

    constructor (mediaTemplate) {

        this.layerIndex = mediaTemplate.layerIndex;
        this.mediaIndex = mediaTemplate.mediaIndex;
        this.resource = mediaTemplate.resource;
        this.timelineTime = mediaTemplate.timelineTime;
    
        if (mediaTemplate.videoStartTime) 
        this.videoStartTime = mediaTemplate.videoStartTime;
        else this.videoStartTime = 0;

        if (mediaTemplate.position) 
        this.position = mediaTemplate.position;
        else this.position = [0, 0];

        if (mediaTemplate.size) 
        this.size = mediaTemplate.size;
        else this.size = [50, 50];

    }

}

class Layer {

    _store = {
        media: []
    }
    
    layerIndex;

    _uniquifyMedia = function () {
        this._store.media.forEach(function(media, index){
            media.mediaIndex = index; 
        });
    }

    addMedia (mediaTemplate) {
        mediaTemplate.mediaIndex = this._store.media.length;
        this._store.media.push(new Media(mediaTemplate));
        return mediaTemplate.mediaIndex;
    }

    insertMedia (mediaTemplate) {
        mediaTemplate.mediaIndex = this._store.media.length;
        this._store.media.push(mediaTemplate);
    }

    getAllMedia () {
        return this._store.media;
    }

    getMedia = function (mediaIndex){
        return this._store.media[mediaIndex];
    }

    deleteMedia (mediaIndex) {
        this._store.media.splice(mediaIndex, 1);
        this._uniquifyMedia();
    }

    deleteAllMedia () {
        this._store.media = [];
    }

    constructor(layerIndex, mediaTemplate=false){
        
        this.layerIndex = layerIndex;

        if(mediaTemplate)
        this.addMedia(mediaTemplate);

    }

}

export default Layer
