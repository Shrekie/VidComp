export default function () {

    var store = {
        layers: []
    };

    this.getLayers = function (index) {
        return store.layers;
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