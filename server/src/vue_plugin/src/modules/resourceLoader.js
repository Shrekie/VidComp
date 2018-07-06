export default function () {

    var store = {
        sources: []
    };

    var castMedia = function (media){

        if(media.resource.type == 'image'){
            var image = new Image();
            image.src = media.resource.url;
            store.sources.push({media:media, cast:image, type:media.resource.type});
        }

    };

    this.eachSource = function (cb) {

        store.sources.forEach(function(source, index){
            cb(source, index);
        });

    };

    this.loadSelectedMedia = function (resource) {

        this.eachSource(function(source, index){
            if(source.media.resource === resource){
                // Delete listing
                store.sources.splice(index, 1);
                // Recast
                castMedia(source.media);
            }
        });

    };

    this.loadMedia = function (media) {
        castMedia(media);
    };

};