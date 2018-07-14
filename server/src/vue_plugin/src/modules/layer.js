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

    this.getAllMedia = function () {
        return store.media;
    };

    this.getMedia = function (mediaIndex){
        return store.media[mediaIndex];
    };

    this.changeMedia = function (mediaChange) {
        store.media[mediaChange.mediaIndex] = mediaChange;
        console.log(store.media[mediaChange.mediaIndex]);
    };

    this.addMedia = function (newMedia) {
        newMedia.mediaIndex = store.media.length;
        store.media.push(new Media(newMedia));
        return newMedia.mediaIndex;
    };

    //FIXME: remove this, remember change
    this.eachMedia = function (cb) {

        store.media.forEach(function(resource){
            cb(resource);
        });
        
    };

    if(newMedia)this.addMedia(newMedia);

};
