export default function () {

    var store = {
        layers: []
    };

    this.getLayer = function (index) {
        return store.layers[index];
    }

    this.addLayer = function (layer) {
        return store.layers.push(layer);
    };

    this.eachLayer = function (cb) {
        store.layers.forEach(function(layer){
            cb(layer);
        });
    };

};