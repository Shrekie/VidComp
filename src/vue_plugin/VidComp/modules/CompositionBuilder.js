import Layer from './Layer.js';

class CompositionBuilder {

    _sourceLoader;
    _resourceImporter;
    _timeline;

    createLayer (newLayer) {

        if(newLayer.newResource && newLayer.newMedia){
    
            // create layer with media and resource
            newLayer.newMedia.resource = this._resourceImporter
            .importResource(newLayer.newResource, this._sourceLoader);
            let layer = new Layer(newLayer.newMedia.layerIndex);
            let mediaIndex = layer.addMedia(newLayer.newMedia);
            this._timeline.addLayer(layer);
            this._sourceLoader.loadMedia(layer.getMedia(mediaIndex));
    
            return {
                layerIndex:layer.layerIndex,
                mediaIndex:mediaIndex,

                loadedResource:newLayer.newMedia.resource.loadedResource,
                fetchResponse:newLayer.newMedia.resource.fetchResponse
            }
    
        }else if (newLayer.newMedia) {
    
            // create layer with empty media
            let layer = new Layer(newLayer.newMedia.layerIndex);
            let mediaIndex = layer.addMedia(newLayer.newMedia);
            this._timeline.addLayer(layer);
            this._sourceLoader.loadMedia(layer.getMedia(mediaIndex));
    
            return {
                layerIndex:layer.layerIndex,
                mediaIndex:mediaIndex
            }
    
        }else{
    
            // create layer with no media
            let layer = new Layer(newLayer.layerIndex);
            this._timeline.addLayer(layer);
    
            return {
                layerIndex:layer.layerIndex
            }
    
        }
    
    }
    
    addMedia (newMedia) {
        
        if ( newMedia.newResource ){
    
            // add new resource to new media in existing layer
            let layer = this._timeline.getLayer(newMedia.newMedia.layerIndex);
            newMedia.newMedia.resource = this._resourceImporter
            .importResource(newMedia.newResource,this._sourceLoader);
            let mediaIndex = layer.addMedia(newMedia.newMedia);
            this._sourceLoader.loadMedia(layer.getMedia(mediaIndex));
            
            return {
                mediaIndex: mediaIndex,

                loadedResource:newMedia.newMedia.resource.loadedResource,
                fetchResponse:newMedia.newMedia.resource.fetchResponse
            }
    
        }else if ( newMedia.resource ) {
    
            // add new media with existing resource
            let layer = this._timeline.getLayer(newMedia.newMedia.layerIndex);
            newMedia.newMedia.resource = this._resourceImporter
            .importResource(newMedia.resource, this._sourceLoader);
            let mediaIndex = layer.addMedia(newMedia.newMedia);
            this._sourceLoader.loadMedia(layer.getMedia(mediaIndex));
    
            return {
                mediaIndex: mediaIndex,

                loadedResource:newMedia.newMedia.resource.loadedResource,
                fetchResponse:newMedia.newMedia.resource.fetchResponse
            }
    
        } else {
    
            // add new media without resource
            let layer = this._timeline.getLayer(newMedia.layerIndex);
            let mediaIndex = layer.addMedia(newMedia);
            this._sourceLoader.loadMedia(layer.getMedia(mediaIndex));
    
            return {
                mediaIndex: mediaIndex
            }
    
        }
    
    }

    preparedSources () {
        return Promise.all(this._resourceImporter.getResourceLoad())
        .then(function(){
            return Promise.all(this._sourceLoader.getCastLoading());
        }.bind(this));
    }

    constructProject (project) {

        if(project.layers.length > 0){
            project.layers.forEach(layer => {
                this.createLayer({layerIndex:layer.layerIndex});
            });
        }

        /*
        if(project.resources.length > 0){
            project.resources.forEach(resource => {

                this._resourceImporter.importResource({
                        name: resource.name,
                        resourceLink: resource.resourceLink,
                        origin: resource.origin
                }, this._sourceLoader);

            });
        }
        */

        if(project.media.length > 0){
            project.media.forEach(media => {
                this.addMedia({
    
                    newMedia: {
                        layerIndex: media.layerIndex,
                        size: media.size,
                        timelineTime: media.timelineTime,
                        position: media.position,
                        videoStartTime: media.videoStartTime
                    },
    
                    newResource: {
                        name: media.resource.name,
                        resourceLink: media.resource.resourceLink,
                        origin: media.resource.origin,
                        type: media.resource.type
                    }
    
                });
            });
        }

    }

    constructor(sourceLoader, resourceImporter, timeline){

        this._sourceLoader = sourceLoader;
        this._resourceImporter = resourceImporter;
        this._timeline = timeline;

    }

}

export default CompositionBuilder;

/*
    #FIXME: LAME TEMPLATE NAMES.

    newMedia: {
        layerIndex: ,
        size: [, ],
        timelineTime:
        position: [,],
        videoStartTime: 0
    },

    newResource: {
        name:,
        resourceLink:,
        resourceType: 'image'
    }

*/