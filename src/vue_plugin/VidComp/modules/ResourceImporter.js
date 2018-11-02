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

        resource.fetchResponse = new Promise(function(resolve, reject){

            this._fetchResource(newResource)
            .then(res => {

                if(res.error){

                    alert("error retrieving media resource, is url broken?");
                    reject(res.error);

                }else{

                    resolve(res);

                }

            });

        }.bind(this));

        if(newResource.origin == "youtube"){

            resource.type = "video";

            resource.loadedResource = resource.fetchResponse.then(function(res){

                return res.blob().then(function(blob){
                    resource.url = URL.createObjectURL(blob);
                    sourceLoader.loadSelectedResource(resource);
                    return resource;
                });

            });

        } else {

            resource.loadedResource = resource.fetchResponse.then(function(res){

                return res.blob().then(function(blob){

                    var fileType = BlobAnalyzer.determineType(blob);

                    if(fileType == "undefined"){

                        alert("Could not determine file type, please report this error.");
                        throw new TypeError('no file type');

                    }else{

                        resource.url = URL.createObjectURL(blob);
                        resource.type = fileType;
                        sourceLoader.loadSelectedResource(resource);
                        return resource;

                    }

                });

            }.bind(this));

        }

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