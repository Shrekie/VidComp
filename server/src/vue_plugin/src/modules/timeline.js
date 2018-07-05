export default function () {

    var store = {
        layers: new Map()
    };

    this.addLayer = function (layer) {
        store.layers.set(layer.name, layer);
    };

    this.eachLayer = function (cb) {
        store.layers.forEach(function(value, key, map){
            cb({data:value.data, name:value.name});
        });
    };

};