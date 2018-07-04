/*
    Client side calls to server API.
    #TODO: rename file and split.
*/
import Axios from 'axios';
export default {
    getUser(cb){
        Axios.get('/me')
        .then(function (response) {
            console.log(response);
            cb(response.data.user);
        })
        .catch(function (error) {
            cb(error);
        });
    }
};