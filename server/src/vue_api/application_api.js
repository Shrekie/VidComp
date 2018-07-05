/*
    Client side calls to server API.
    #TODO: rename file and split.
    #TODO: handle errors.
*/

import Axios from 'axios';
export default {

    getUsers(cb){
        Axios.get('/users')
        .then(function (response) {
            console.log(response);
            cb(response.data.users);
        })
        .catch(function (error) {
            cb(error);
        });
    },

    createUser(name, cb) {
        Axios.post('/newUser', {
            name
        })
        .then(function (response) {
            console.log(response);
            cb(response.data.user);
        })
        .catch(function (error) {
            cb(error);
        });
    }

};