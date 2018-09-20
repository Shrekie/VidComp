/*

    Google client side auth.
    Popup, window load check.

*/

import Axios from 'axios';

export default {

    authenticate: function(cb){

		var width = 800, height = 600;
		var w = window.outerWidth - width, h = window.outerHeight - height;
		var left = Math.round(window.screenX + (w / 2));
		var top = Math.round(window.screenY + (h / 2.5));

		var loginWindow = window.open('/auth/google', 'logIn', 'width='+width+',height='+height+',left='+left+',top='+top+
		',toolbar=0,scrollbars=0,status=0,resizable=0,location=0,menuBar=0');

    },

    checkAuthentication: function(cb){
        
        Axios.get('/checkLogin')
        .then(function (response) {
            console.log(response.data);
            cb(response.data);
        })
        .catch(function (error) {
            console.log("AYOOOO" + error)
            cb(error);
        });

	}

}