export default function (newMedia) {

    var store = {
        media: []
    }

    var Media = function (newMedia){
        this.time = newMedia.time;
        this.name = newMedia.mediaName;
        this.resource = newMedia.resource;
    };

    this.getMedia = function (name){
        return store.media.find(function(element) 
        {return element.name == name;});
    };

    this.getMedias = function () {
        return store.media;
    }

    var setMedia = function (mediaChange) {

        var mediaResource = this.getMedia(mediaChange.mediaName);
        
        if(mediaChange.time){
            mediaResource.time = mediaChange.time;
        }

    };

    this.addMedia = function (newMedia) {
        store.media.push(new Media(newMedia));
    };

    
    this.eachMedia = function (cb) {
        store.media.forEach(function(resource){
            cb(resource);
        });
    };
    

    this.changeMedia = function(mediaChange){
        setMedia(mediaChange);
    };

    if(newMedia)this.addMedia(newMedia);

};
