export default function () {

    var store = {
        resources: []
    };

    var fetchResource = function (resourceLink, cb) {
        fetch(resourceLink)
        .then(res => res.blob())
        .then(blob => {
            cb(URL.createObjectURL(blob))
        });
    };

    var existingResource = function (name) {
        return store.resources.find(function(element){
            return element.name == name;
        });
    };

    this.changeResource = function(resourceChange, cb){

        var resource = existingResource(resourceChange.resourceName);

        if(resourceChange.newResourceName) resource.name = resourceChange.newResourceName;
        if(resourceChange.resourceType) resource.type = resourceChange.resourceType;

        if(resourceChange.resourceLink){
            fetchResource(resourceChange.resourceLink, function(url){
                console.log(store.resources);
                resource.url = url;
                cb(resource);
            });
        }else{
            cb(resource);
        }

    }

    this.importResource = function (newResource, cb) { 

        var resourceExists = existingResource(newResource.resourceName);

        if(resourceExists){
            cb(resourceExists);
        }
        else{
            fetchResource(newResource.resourceLink, function(url){
                var resource = {
                    name:newResource.resourceName,
                    url:url,
                    type: newResource.resourceType
                };
                store.resources.push(resource);
                cb(resource);
            });
        }

    };

};