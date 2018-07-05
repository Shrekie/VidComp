export default function () {

    var store = {
        resources: new Map()
    }

    var fetchResource = function (resourceLink, cb) {
        fetch(resourceLink)
        .then(res => res.blob())
        .then(blob => {
            cb(URL.createObjectURL(blob))
        });
    };

    this.importResource = function (resourceLink, name, cb) { 
        fetchResource(resourceLink, function(url){
            var rawResource = {url:url, type:'image'};
            store.resources.set(name, rawResource);
            cb({name, rawResource});
        });
    };

    this.removeImport = function (name) {
        return store.resources.delete(name);
    };

    this.getImport = function (name) {
        return {name:name, data:store.resources.get(name)};
    };

};