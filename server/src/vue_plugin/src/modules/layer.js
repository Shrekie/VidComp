export default function (layerIndex, newMedia) {

    var store = {
        media: []
    }

    this.layerIndex = layerIndex;

    var Media = function (newMedia){ 

        this.name = newMedia.name;
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

    this.getMedia = function (name){
        return store.media.find(function(element) 
        {return element.name == name;});
    };

    var getMediaIndex = function (name){
        return store.media.findIndex(function(element) 
        {return element.name == name;});
    };

    this.changeMedia = function (mediaChange) {

        var mediaIndex = getMediaIndex(mediaChange.name);
        store.media[mediaIndex] = mediaChange;

    };

    this.addMedia = function (newMedia) {
        store.media.push(new Media(newMedia));
    };

    
    this.eachMedia = function (cb) {

        store.media.forEach(function(resource){
            cb(resource);
        });
        
    };

    if(newMedia)this.addMedia(newMedia);

};
