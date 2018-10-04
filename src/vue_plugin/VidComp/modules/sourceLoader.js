import _ from 'lodash';

export default function () {

    var store = {
        sources: []
    };

    // TODO: make casting async
    
    var castMedia = function (media){

        if(!media.resource) {

            console.log('YOU CASTED MEDIA WITH NO RESOURCE');

        }else if(media.resource.url == 'fetching'){
            
            // TODO: do something better while fetching
            var image = new Image();
            image.src = 'https://i.imgur.com/IaS4CqB.png';
            store.sources.push({media:media, cast:image, type: 'image', status:"ready"});

        }else{

            // TODO: in future just make a includes branch for audio

            if(media.resource.type == 'image'){

                var image = new Image();
                image.src = media.resource.url;
                store.sources.push({media:media, cast:image, type:media.resource.type, status:"ready"});

            }
    
            if(media.resource.type == 'video'){

                var video = document.createElement("video");
                video.src = media.resource.url;
                video.muted = true;

                video.onloadeddata = function() {

                    var audio = document.createElement("audio");
                    audio.muted = false;
                    audio.src = media.resource.url;
                    store.sources.push({media:media, cast:audio, type:'audio-throw', status:"ready"});

                };

                store.sources.push({media:media, cast:video, type:media.resource.type, status:"ready"});

            }

        }

        
    };

    var decastMedia = function (source) {

        // hey gc get these pls
        // seems to be working nicely
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
                decastMedia(store.sources[i]);
                if(store.sources[i].type.includes("throw") == false ) castMedia(store.sources[i].media);
                console.log(store.sources[i]);
                store.sources.splice(i, 1);
            }
        }

        this.sortMediaLayers();

    };

    this.getEndTime = function () {
        return Math.max.apply(Math, store.sources.map(function(source) { return source.media.timelineTime[1]; }));
    };

    this.getVideoSources = function (){
        return store.sources.filter(source => source.type == "video" || source.type == "audio");
    };

    this.getAudioSources = function (){
        return store.sources.filter(source => source.type.includes("audio"));
    };

    this.loadMedia = function (media) {
        castMedia(media);
        this.sortMediaLayers();
    };

    this.clearSources = function () {
        store.sources.splice(0,store.sources.length)
    }

};