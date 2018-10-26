import BlobAnalyzer from '../../../library/fileManager/BlobAnalyzer.js';

class ResourceImporter {

    _store = {
        resources: []
    }

    _proxyurl;
    
    _fetchResource (resourceLink) {
        return fetch(this._proxyurl + resourceLink)
            .then(res => {
                if (res.status === 200) {
                    return res;
                } else {
                    throw new Error(res.statusText);
                }
            })
        .catch(error => { return {error} });
    }

    getAllResources () {
        return this._store.resources;
    }

    _existingResource (name) {
        return this._store.resources.find(function(element){
            return element.name == name;
        });
    }

    _saveBlob (newResource, resource, sourceLoader) {

        resource.loadedResource = new Promise(function(resolve, reject){

            this._fetchResource(newResource.resourceLink)
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

        }.bind(this));

        return resource;

    }

    importResource (newResource, sourceLoader) { 

        var resourceExists =  this._existingResource(newResource.name);

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

            this._store.resources.push(resource);

            return this._saveBlob(newResource, resource, sourceLoader);

        }

    }

    constructor () {
        this._proxyurl = "";
    }

};

export default ResourceImporter;