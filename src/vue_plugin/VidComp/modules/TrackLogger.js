import _ from 'lodash';
import UndoRedo from '../../../library/contextHook/UndoRedo.min.js';

class TrackLogger {

    _compositionBuilder;
    _timeline;
    _sourceLoader;
    _stack;

    undo () {
        var data = this._stack.undo();
        if(data){
            this._setState(_.cloneDeep(data));
        }
    }

    redo () {
        var data = this._stack.redo();
        if(data){
            this._setState(_.cloneDeep(data));
        }
    }

    _addState (state) {
        this._stack.add(_.cloneDeep(state));
    }

    _setState (state) {
        

        this._timeline.deleteAllLayers();

        this._sourceLoader.clearSources();

        if(state.layers.length > 0){

            state.layers.forEach(layer => {
                this._compositionBuilder.createLayer({layerIndex:layer.layerIndex});
            });

        }

        if(state.media.length > 0){
            state.media.forEach(media => {
                this._compositionBuilder.addMedia({

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
    
    log () {
        this._addState({
            media: this._timeline.getAllMedia(),
            layers: this._timeline.getAllLayers()
        });
    }

    constructor(compositionBuilder, timeline, sourceLoader){

        this._compositionBuilder = compositionBuilder;
        this._timeline = timeline;
        this._sourceLoader = sourceLoader;
        this._stack = new UndoRedo.UndoRedo({limit: 100});
        
    }
    
}

export default TrackLogger;