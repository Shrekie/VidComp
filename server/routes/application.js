var express = require('express');
var router = express.Router();
const User = require('./../model/user');

router.post('/newUser', (req, res)=>{

	const name = req.body.name;

	User.create({ 
        name: name, 
    }, function (err, user) {
		if (err){
			console.log(err);
		}else{
			res.json({user:user});
		}
	});
	
});

router.get('/users', (req, res)=>{
	
	User.find({},function (err, users) {
        if (err){
            console.log(err);
        };
        if (users === null) {
            console.log('none found');
        }
        else{
            res.json({users:users});
        }
    });
	
});

module.exports = router;