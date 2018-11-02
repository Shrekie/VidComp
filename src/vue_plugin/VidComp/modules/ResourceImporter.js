import BlobAnalyzer from '../../../library/fileManager/BlobAnalyzer.js';
import Axios from 'axios';

class ResourceImporter {

    _store = {
        resources: []
    }

    _proxyurl;
    
    _fetchResource (newResource) {

        if(newResource.origin == "youtube"){

            return Axios.get('/ytStream', {
                params: {
                    ytUrl:newResource.resourceLink
                }
            })
            .then(function (response) {

                console.log(this._proxyurl + response.data.stream);

                return fetch(this._proxyurl + response.data.stream)
                .then(res => {
                    if (res.status === 200) {
                        return res;
                    } else {
                        throw new Error(res.statusText);
                    }
                })
                .catch(error => { return {error} });
    
            }.bind(this))
            .catch(function (error) {
                return error;
            });

        }else{

            console.log(this._proxyurl + newResource.resourceLink);
            return fetch(newResource.resourceLink)
            .then(res => {
                if (res.status === 200) {
                    return res;
                } else {
                    throw new Error(res.statusText);
                }
            })
            .catch(error => { return {error} });

        }

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
        console.log(newResource);
        resource.loadedResource = new Promise(function(resolve, reject){

            this._fetchResource(newResource)
            .then(res => {

                if(res.error){

                    alert("error retrieving media resource, is url broken?");
                    reject(res.error);

                }else{

                    res.blob().then(function(blob){

                        var fileType = BlobAnalyzer.determineType(blob);

                        if(fileType == "undefined"){

                            alert("Could not determine file type, please report this error.");
                            reject(res.error);
                            
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
                resourceLink: newResource.resourceLink,
                origin: newResource.origin
            };

            this._store.resources.push(resource);

            return this._saveBlob(newResource, resource, sourceLoader);

        }

    }

    constructor () {
        this._proxyurl = "https://cors-anywhere.herokuapp.com/";
    }

}

export default ResourceImporter;