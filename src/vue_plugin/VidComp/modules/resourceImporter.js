import BlobAnalyzer from '../../../library/fileManager/BlobAnalyzer.js'; //TODO: move library to top public level

export default function () {

    var store = {
        resources: []
    };

    const proxyurl = ""; // TODO: make my own proxy https://cors-anywhere.herokuapp.com/
    
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

        resource.loadedResource = new Promise(function(resolve, reject){

            fetchResource(newResource.resourceLink)
            .then(res => {

                if(res.error){

                    alert("error retrieving media resource, is url broken?");
                    reject();

                }else{

                    res.blob().then(function(blob){

                        var fileType = BlobAnalyzer.determineType(blob);

                        if(fileType == "undefined"){

                            alert("Could not determine file type, please report this error.");
                            reject();
                            
                        }else{

                            resource.url = URL.createObjectURL(blob);
                            resource.type = fileType;
                            sourceLoader.loadSelectedResource(resource);
                            resolve(resource);

                        }

                    });

                }

            }); 

        });

        return resource;

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