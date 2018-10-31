import MediaShift from './MediaShift.js';
import Layer from './Layer.js';

class ShiftOrder {

    _timeline;

    _currentTimelinePos;
    _newTimelinePos;
    _sourceLoader;
    
    _priorStep (currentMedia, changedMedia) {

        if(!currentMedia.length > 0){

            // layer media moved from has 0 media, delete the layer
            this._timeline.deleteLayer(this._currentTimelinePos.layerIndex);
            this._timeline.contextHooks.runContextHooks({name:'mediaShift'});
            if(changedMedia.layerIndex == this._newTimelinePos.layerIndex){
                console.log(this._timeline._store.layers);
            }

        }else{

            this._timeline.contextHooks.runContextHooks({name:'mediaShift'});

        }

    }

    _dripChanged (changedMedia, affectedLayerMedia) {

        if(this._newTimelinePos.layerIndex == this._currentTimelinePos.layerIndex){

            // same layer
            MediaShift.checkShift(affectedLayerMedia, changedMedia);
            this._timeline.contextHooks.runContextHooks({name:'mediaShift'});

        }else{

            // new layer, delete from old one and add to new
            this._timeline.getLayer(this._newTimelinePos.layerIndex).insertMedia(changedMedia);
            this._timeline.getLayer(this._currentTimelinePos.layerIndex).deleteMedia(this._currentTimelinePos.mediaIndex);

            this._sourceLoader.sortMediaLayers();

            let currentMedia = this._timeline.getLayer(this._currentTimelinePos.layerIndex).getAllMedia();

            MediaShift.checkShift(affectedLayerMedia, changedMedia);
            
            this._priorStep(currentMedia, changedMedia);

        }

    }

    _precedenceCascade (affectedLayerMedia) {

        let changedMedia = this._timeline.getLayer(this._currentTimelinePos.layerIndex)
        .getMedia(this._currentTimelinePos.mediaIndex);

        let changedMediaSize = changedMedia.timelineTime[1] - changedMedia.timelineTime[0];

        changedMedia.timelineTime[0] = this._newTimelinePos.timelineStartTime;
        changedMedia.timelineTime[1] = this._newTimelinePos.timelineStartTime + changedMediaSize;

        MediaShift.formatTimelineValue(changedMedia);
        
        if(changedMedia.timelineTime[0] < 0){
            MediaShift.negativePush(affectedLayerMedia, changedMedia);
        }

        changedMedia.layerIndex = this._newTimelinePos.layerIndex;

        return changedMedia;

    }

    _stepLayer () {


        let affectedLayerMedia = this._timeline.getLayer(this._newTimelinePos.layerIndex);

        if(!affectedLayerMedia){

            let newLayer = new Layer(this._timeline._store.layers.length);
            this._timeline.addLayer(newLayer);
            affectedLayerMedia = newLayer.getAllMedia();
            this._newTimelinePos.layerIndex = this._timeline._store.layers.length - 1;

        }else{

            affectedLayerMedia = affectedLayerMedia.getAllMedia();

        }

        return affectedLayerMedia;

    }

    _relativeTimelinePos () {

        if (this._newTimelinePos.layerIndex < 0){

            if(!this._currentTimelinePos.layerIndex == 0){
                this._newTimelinePos.layerIndex = 
                Math.abs( Math.abs(this._newTimelinePos.layerIndex) - this._currentTimelinePos.layerIndex );
            }else{
                this._newTimelinePos.layerIndex = 0;
            }

        }else{
            this._newTimelinePos.layerIndex = 
            this._newTimelinePos.layerIndex + this._currentTimelinePos.layerIndex;
        }

        if(this._newTimelinePos.layerIndex < 0) this._newTimelinePos.layerIndex = 0;

    }

    adjustMediaTimeShift (direction, layerIndex, 
    mediaIndex, timelineTime) {
            
        let changedMedia = this._timeline.getLayer(layerIndex).getMedia(mediaIndex);
        let affectedLayerMedia = this._timeline.getLayer(layerIndex).getAllMedia();

        if(direction == "forwards"){
            MediaShift.shiftTimeMedia(affectedLayerMedia, 
            direction, changedMedia, timelineTime, this._sourceLoader);
        }else{
            MediaShift.shiftTimeMedia(affectedLayerMedia, 
            direction, changedMedia, timelineTime, this._sourceLoader);
        }

        this._timeline.contextHooks.runContextHooks({name:'mediaShift'});
    
    }

    adjustMediaShift (currentTimelinePos, newTimelinePos) {

        //Based on new position of media, apply changes to timeline.
        //#FIXME: mediaIndex indifferent, only maintains uniqueness but makes mediaIndex dirty

        this._currentTimelinePos = currentTimelinePos;
        this._newTimelinePos = newTimelinePos;

        // determine new layer position based on relative value
        this._relativeTimelinePos();
        
        // get media from layer of layer index
        let affectedLayerMedia = this._stepLayer();

        let changedMedia = this._precedenceCascade(affectedLayerMedia);

        this._dripChanged(changedMedia, affectedLayerMedia);

    }

    constructor (timeline, sourceLoader) {
        this._timeline = timeline;
        this._sourceLoader = sourceLoader;
    }

}

class Timeline {

    _store = {
        layers: []
    }
    _sourceLoader;

    shiftOrder;

    contextHooks;

    _uniquifyLayer () {

        this._store.layers.forEach(function(layer, index){
            layer.getAllMedia().forEach(function(media, index){
                media.layerIndex = layer.layerIndex;
            });
        });

    }

    getLayer (layerIndex) {
        return this._store.layers.find(function(layer){
            return layer.layerIndex == layerIndex;
        });
    }

    getAllLayers () {
        return this._store.layers;
    }

    deleteAllLayers () {
        this._store.layers.splice(0,this._store.layers.length)
    }

    getAllMedia () {
        
        var allMedia = [];
        this.getAllLayers().forEach(function(layer){
            layer.getAllMedia().forEach(function(media){
                allMedia.push(media);
            })
        });
        return allMedia;

    }

    addLayer (layer) {
        return this._store.layers.push(layer);
    }

    deleteLayer (layerIndex) {

        this._store.layers.splice(layerIndex, 1);
        this._store.layers.forEach(function(layer, index){
            layer.layerIndex = index;
        });
        this._uniquifyLayer();

    }

    deleteLayerMedia (layerIndex, mediaIndex) {

        let newLayerIndexPointer = layerIndex;

        let mediaLayer = this.getLayer(layerIndex)

        this._sourceLoader.deleteSourceMedia(layerIndex, mediaIndex);
        mediaLayer.deleteMedia(mediaIndex);

        if( !(mediaLayer.getAllMedia().length > 0) 
        && this.getAllLayers().length > 1){
            this.deleteLayer(layerIndex);
            if(newLayerIndexPointer > 0) newLayerIndexPointer -= 1;
        }
        
        this.contextHooks.runContextHooks({name:'mediaShift'});

        return newLayerIndexPointer;

    }

    constructor(ContextHooks, sourceLoader){

        this.contextHooks = ContextHooks.createHook("layerControl");
        this._sourceLoader = sourceLoader;
        this.shiftOrder = new ShiftOrder(this, sourceLoader);

    }

}


export default Timeline;