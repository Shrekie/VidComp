import _ from 'lodash';

export default function () {

    var store = {
        sources: []
    };

    var Cast = function (media, cast, type){

        this.media = media;
        this.cast = cast;
        this.type = type;
        this.status = "ready";

    }

    // TODO: make casting async
    
    var castMedia = function (media){

        //TODO: Move this to blob analyzer
        function hasAudio (video) {
            return video.mozHasAudio ||
            Boolean(video.webkitAudioDecodedByteCount) ||
            Boolean(video.audioTracks && video.audioTracks.length);
        }

        if(!media.resource) {

            console.log('YOU CASTED MEDIA WITH NO RESOURCE');

        }else if(media.resource.url == 'fetching'){
            
            // TODO: do something better while fetching
            var image = new Image();
            image.src = 'https://i.imgur.com/IaS4CqB.png';
            store.sources.push(new Cast(media, image, 'image'));

        }else{

            // TODO: in future just make a includes branch for audio

            if(media.resource.type == 'image'){

                var image = new Image();
                image.src = media.resource.url;
                store.sources.push(new Cast(media, image, media.resource.type));

            }
    
            if(media.resource.type == 'video'){

                var video = document.createElement("video");
                video.src = media.resource.url;
                video.muted = true;

                    video.onloadeddata = function() {

                        if(hasAudio(video)){
                            var audio = document.createElement("audio");
                            audio.src = media.resource.url;
                            store.sources.push(new Cast(media, audio, 'audio-throw'));
                        }
                        
                    };
                    
                store.sources.push(new Cast(media, video, media.resource.type));

            }

        }

        
    };

    var decastMedia = function (source) {

        // burn
        if(source.type.includes('video')){
            source.cast.pause();
            source.cast.src = '';
        }
        if(source.type.includes('image')){
            source.cast.src = '';
        }
        if(source.type.includes('audio')){
            source.cast.pause();
            source.cast.src = '';
        }
        //delete source.type;
        delete source.cast;
        delete source.status;

    };
 
    this.sortMediaLayers = function(){

        function compare(a,b) {
            if (a.media.layerIndex < b.media.layerIndex)
              return -1;
            if (a.media.layerIndex > b.media.layerIndex)
              return 1;
            return 0;
        }
          
        store.sources.sort(compare);
        console.log(store.sources);

    }

    this.eachSource = store.sources;

    this.loadSelectedResource = function (resource) {

        // deletes and recasts media that has 'resource'

        let i = store.sources.length;

        while (i--) {
            if( store.sources[i].media.resource.name == resource.name ){
                store.sources[i].status = "deleting";
                decastMedia(store.sources[i]);
                if(store.sources[i].type.includes("throw") == false ) castMedia(store.sources[i].media);
                console.log(store.sources[i]);
                store.sources.splice(i, 1);
            }
        }

        this.sortMediaLayers();

    };

    this.deleteSourceMedia = function (layerIndex, mediaIndex){
        store.sources.splice(store.sources.findIndex(source => 
            source.media.layerIndex == layerIndex && 
            source.media.mediaIndex == mediaIndex ), 1);
    };

    this.getEndTime = function () {
        return Math.max.apply(Math, store.sources.map(function(source) { return source.media.timelineTime[1]; }));
    };

    this.getControlledSources = function(){
        return store.sources.filter(source => source.type.includes("audio") || source.type.includes("video"));
    };

    this.getVideoSources = function (){
        return store.sources.filter(source => source.type == "video");
    };

    this.getAudioSources = function (){
        return store.sources.filter(source => source.type.includes("audio"));
    };

    this.getMediaCast = function (media) {
        return store.sources.find(source => source.media === media ).cast;
    }

    this.loadMedia = function (media) {
        castMedia(media);
        this.sortMediaLayers();
    };

    this.clearSources = function () {
        store.sources.splice(0, store.sources.length)
    }

};