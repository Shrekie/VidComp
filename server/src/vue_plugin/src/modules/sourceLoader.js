export default function () {

    var store = {
        sources: []
    };

    // TODO: make casting async
    
    var castMedia = function (media){

        if(!media.resource) {
            console.log('YOU CASTED MEDIA WITH NO RESOURCE');
            // TODO: do something about media with no resource
            // maybe give cast that just renders them black or something
        }else{

            if(media.resource.type == 'image'){
                var image = new Image();
                image.src = media.resource.url;
                store.sources.push({media:media, cast:image, type:media.resource.type});
            }
    
            if(media.resource.type == 'video'){
                var video = document.createElement("video");
                video.src = media.resource.url;
                store.sources.push({media:media, cast:video, type:media.resource.type});
            }

        }

        
    };

    var decastMedia = function (source) {

        // hey gc get these pls
        // seems to be working nicely
        if(source.type == 'video'){
            source.cast.pause();
            source.cast.src = '';
        }
        if(source.type == 'image'){
            source.cast.src = '';
        }
        delete source.type;
        delete source.cast;

    };

    this.eachSource = function (cb) {

        store.sources.forEach(function(source, index){
            cb(source, index);
        });

    };

    this.loadSelectedResource = function (resource) {

        let i = store.sources.length;

        while (i--) {
            if( store.sources[i].media.resource.name == resource.name ){
                decastMedia(store.sources[i]);
                castMedia(store.sources[i].media);
                store.sources.splice(i, 1);
            }
        }

    };

    this.loadMedia = function (media) {
        castMedia(media);
    };

};