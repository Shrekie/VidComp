import BlobAnalyzer from './../../../vue_app/library/fileManager/blobAnalyzer.js'; //TODO: move library to top public level

export default function () {

    var store = {
        resources: []
    };

    var blobAnalyzer = new BlobAnalyzer();

    const proxyurl = "https://cors-anywhere.herokuapp.com/"; // TODO: make my own proxy
    
    var fetchResource = function (resourceLink) {
        return fetch(proxyurl + resourceLink)
                .then(res => {
                    if (res.status === 200) {
                        return res;
                    } else {
                        throw new Error(res.statusText);
                    }
                })
                .catch(error => { return {error} });
    };

    this.getAllResources = function(){
        return store.resources;
    }

    this.existingResource = function (name) {
        return store.resources.find(function(element){
            return element.name == name;
        });
    };

    this.saveBlob = function (newResource, resource, sourceLoader) {

        fetchResource(newResource.resourceLink)
        .then(res => {
            if(res.error){
                alert("error retrieving media resource, is url broken?");
            }else{
                res.blob().then(function(blob){

                    var fileType = blobAnalyzer.determineType(blob);
                    if(fileType == "undefined"){
                        alert("Could not determine file type, please report this error.");
                    }else{
                        resource.url = URL.createObjectURL(blob);
                        resource.type = fileType;
                        sourceLoader.loadSelectedResource(resource);
                    }

                });
            }
        }); 
        return resource;

    }

    this.changeResource = function(resourceChange, sourceLoader){

        var resource = this.existingResource(resourceChange.name);

        if(resourceChange.name) resource.name = resourceChange.name;
        if(resourceChange.resourceType) resource.type = resourceChange.resourceType;

        if(resourceChange.resourceLink){

            resource.url = 'fetching';
            sourceLoader.loadSelectedResource(resource);
            return this.saveBlob(resourceChange, resource, sourceLoader);
            
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
                type: newResource.resourceType,
                resourceLink: newResource.resourceLink
            };

            store.resources.push(resource);
            return this.saveBlob(newResource, resource, sourceLoader);

        }

    };

};