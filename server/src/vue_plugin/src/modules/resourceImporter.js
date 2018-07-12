// TODO: catch errors better and stuff, cleanup

export default function () {

    var store = {
        resources: []
    };
    
    const proxyurl = "https://cors-anywhere.herokuapp.com/"; // TODO: make my own proxy
    
    var fetchResource = function (resourceLink) {
        return fetch(proxyurl + resourceLink);
    };

    this.existingResource = function (name) {
        return store.resources.find(function(element){
            return element.name == name;
        });
    };

    this.changeResource = function(resourceChange, sourceLoader){

        var resource = this.existingResource(resourceChange.name);

        if(resourceChange.name) resource.name = resourceChange.name;
        if(resourceChange.resourceType) resource.type = resourceChange.resourceType;

        if(resourceChange.resourceLink){

            resource.url = 'fetching';
            
            sourceLoader.loadSelectedResource(resource);

            fetchResource(newResource.resourceLink)
            .then(res => res.blob())
            .then(blob => {
                resource.url = URL.createObjectURL(blob);
                console.log(resource);
                sourceLoader.loadSelectedResource(resource);
            }); 

            return resource

        }else{
            return resource;
        }

    }

    this.importResource = function (newResource, sourceLoader) { 

        var resourceExists =  this.existingResource(newResource.name);

        if(resourceExists){
            return resourceExists;
        }
        else{

            var resource = {
                name: newResource.name,
                url: 'fetching',
                type: newResource.resourceType
            };

            store.resources.push(resource);
            
            fetchResource(newResource.resourceLink)
            .then(res => res.blob())
            .then(blob => {
                resource.url = URL.createObjectURL(blob);
                console.log(resource);
                sourceLoader.loadSelectedResource(resource);
            }); 

            return resource;

        }

    };

};