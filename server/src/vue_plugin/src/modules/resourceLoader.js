export default function () {

    var store = {
        sources: []
    };

    this.eachResource = function (cb) {

        store.sources.forEach(function(source){
            cb(source);
        });

    };

    this.loadResources = function(timeline){

        /*
            TODO: make this async,
            only update resource changed
        */

        store.sources = [];

        timeline.eachLayer(function(layer){

            layer.eachMedia(function(media){
    
                if(media.resource.type == 'image'){

                    var image = new Image();
                    image.src = media.resource.url;
                    store.sources.push({resource:image, type:media.resource.type});

                }
    
            });
    
        });

    };
};