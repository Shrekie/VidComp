export default function () {

    var store = {
        layers: []
    };

    this.getLayer = function (index) {
        return store.layers[index];
    }

    this.setLayer = function (layer, index) {
        store.layers[index] = layer;
    }

    this.addLayer = function (layer) {
        store.layers.push(layer);
    };

    this.eachLayer = function (cb) {
        store.layers.forEach(function(layer){
            cb(layer);
        });
    };

};