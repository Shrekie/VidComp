import _ from 'lodash';
import UndoRedo from 'undo-redo-js';

export default  function (vidProject, timeline, sourceLoader) {

    var stack = new UndoRedo.UndoRedo({limit: 100});


    this.undo = function (){
        var data = stack.undo();
        console.log(stack.pointer());
        if(data){
            setState(_.cloneDeep(data));
        }
    };

    this.redo = function () {
        var data = stack.redo();
        console.log(stack.pointer());
        if(data){
            setState(_.cloneDeep(data));
        }
    };

    var addState = function (state){
        stack.add(_.cloneDeep(state));
    };

    var setState = function (state){
        

        timeline.deleteAllLayers();

        sourceLoader.clearSources();

        // TODO: create a media constructor class

        if(state.layers.length > 0){
            state.layers.forEach(layer => {
                vidProject.createLayer({layerIndex:layer.layerIndex});
            });
        }

        if(state.media.length > 0){
            state.media.forEach(media => {
                vidProject.addMedia({

                    newMedia: {
                        layerIndex: media.layerIndex,
                        size: media.size,
                        timelineTime: media.timelineTime,
                        position: media.position,
                        videoStartTime: media.videoStartTime
                    },

                    resource: {
                        name: media.resource.name
                    }

                });
            });
        }
        

    }
    
    this.log = function(){
        addState({
            media: timeline.getAllMedia(),
            layers: timeline.getAllLayers()
        });
    }
    
};