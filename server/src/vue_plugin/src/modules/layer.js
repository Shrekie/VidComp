export default function (resource, time) {

    var store = {
        media: []
    }

    var getMedia = function (name){
        return store.media.find(function(element) {return element.resource.name == name;});
    };

    var setMedia = function (layerChange, resource) {

        var mediaResource = getMedia(layerChange.resourceName);
        var mediaIndex = store.media.findIndex(function(element){element.name == name});
        
        if(layerChange.time){
            mediaResource.time = layerChange.time;
        }

        if(resource){
            if(layerChange.oldResourceName){
                mediaResource.resource.name = layerChange.resourceName;
            }
            if(layerChange.resourceLink){
                mediaResource.resource.url = resource.url;
            }
        }
        
        store.media[mediaIndex] = mediaResource;

    };

    this.addMedia = function (resource, time) {
        store.media.push({resource, time});
    };

    this.eachMedia = function (cb) {
        store.media.forEach(function(resource){
            cb(resource);
        });
    };

    this.changeMedia = function(layerChange, resource){
        setMedia(layerChange, resource);
    };

    if(resource)this.addMedia(resource, time);

};
