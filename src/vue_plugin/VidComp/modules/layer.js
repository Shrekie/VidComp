export default function (layerIndex, newMedia) {
 
    var store = {
        media: []
    }

    this.layerIndex = layerIndex;

    var Media = function (newMedia){ 

        this.layerIndex = newMedia.layerIndex;
        this.mediaIndex = newMedia.mediaIndex;
        this.resource = newMedia.resource;
        this.timelineTime = newMedia.timelineTime;

        if (newMedia.videoStartTime) this.videoStartTime = newMedia.videoStartTime;
        else this.videoStartTime = 0;
        if (newMedia.position) this.position = newMedia.position;
        else this.position = [0, 0];
        if (newMedia.size) this.size = newMedia.size;
        else this.size = [100, 100];

    };

    var sortMedia = function () {
        store.media.forEach(function(media, index){
            media.mediaIndex = index; 
        });
    }

    this.getAllMedia = function () {
        return store.media;
    };

    this.getMedia = function (mediaIndex){
        return store.media[mediaIndex];
    };

    this.deleteMedia = function (mediaIndex){
        store.media.splice(mediaIndex, 1);
        sortMedia();
    };

    this.deleteAllMedia = function () {
        store.media = [];
    }

    this.changeMedia = function (mediaChange) {
        store.media[mediaChange.mediaIndex] = mediaChange;
    };

    this.addMedia = function (newMedia) {
        newMedia.mediaIndex = store.media.length;
        store.media.push(new Media(newMedia));
        return newMedia.mediaIndex;
    };

    this.setMedia = function (media){
        store.media = media;
    };

    this.pushMediaIndex = function(fromIndex){

        store.media.forEach(function(media){
            if(media.mediaIndex >= fromIndex){
                media.mediaIndex =  media.mediaIndex + 1;
            }
        });

    };

    this.insertMedia = function (newMedia){
        newMedia.mediaIndex = store.media.length;
        store.media.push(newMedia);
        return newMedia.mediaIndex;
    }

    if(newMedia)this.addMedia(newMedia);

};
