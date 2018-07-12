export default function () {

    var store = {
        resources: []
    };
    
    const proxyurl = "https://cors-anywhere.herokuapp.com/"; // TODO: make my own proxy
    var fetchResource = function (resourceLink, cb) {
        fetch(proxyurl + resourceLink)
        .then(res => res.blob())
        .then(blob => {
            cb(URL.createObjectURL(blob));
        });
    };

    this.existingResource = function (name) {
        return store.resources.find(function(element){
            return element.name == name;
        });
    };

    this.changeResource = function(resourceChange, cb){

        var resource = this.existingResource(resourceChange.name);

        if(resourceChange.name) resource.name = resourceChange.name;
        if(resourceChange.resourceType) resource.type = resourceChange.resourceType;

        if(resourceChange.resourceLink){
            fetchResource(resourceChange.resourceLink, function(url){
                resource.url = url;
                cb(resource);
            });
        }else{
            cb(resource);
        }

    }

    this.importResource = function (newResource, cb) { 

        var resourceExists =  this.existingResource(newResource.name);

        if(resourceExists){
            cb(resourceExists);
        }
        else{
            fetchResource(newResource.resourceLink, function(url){
                var resource = {
                    name:newResource.name,
                    url:url,
                    type: newResource.resourceType
                };
                store.resources.push(resource);
                cb(resource);
            });
        }

    };

};