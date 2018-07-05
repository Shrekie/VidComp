export default function () {

    var fetchResource = function (resourceLink, cb) {
        fetch(resourceLink)
        .then(res => res.blob())
        .then(blob => {
            cb(URL.createObjectURL(blob))
        });
    };

    this.importResource = function (resourceLink, name, cb) { 
        fetchResource(resourceLink, function(url){
            var resource = {name:name, url:url, type:'image'};
            cb(resource);
        });
    };

};