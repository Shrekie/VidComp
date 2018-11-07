var express = require('express');
var router = express.Router();
const ytdl = require('youtube-dl');
const Project = require('./../model/project');
var cors_proxy = require('cors-anywhere');

let proxy = cors_proxy.createServer({
    originWhitelist: [],
    requireHeader: ['origin', 'x-requested-with'],
    removeHeaders: [] 
});

router.get('/ytStream', (req, res)=>{

    var ytUrl = req.param('ytUrl');
    console.log(ytUrl);
    
    if(req.isAuthenticated()){

        ytdl.exec(ytUrl, ['-f best','-s', '-g'], {}, 
        function(err, output) {
            if (err)
            res.status(404).send({message: err})
            else
            res.json({stream:output[0]});
        });

    }

});

router.get('/proxy/:proxyUrl*', (req, res) => {
    if(req.isAuthenticated()){
        req.url = req.url.replace('/proxy/', '/');
        proxy.emit('request', req, res);
    }
});

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

router.get('/projects', (req, res)=>{

    if(req.isAuthenticated()){

        var searchQuery = {
            'profileID': req.user.profileID
        };

        Project.find(searchQuery, function (err, projects) {
            if (err){
                console.log(err);
                res.status(404).send(err);
            } else {
                res.json(projects);
            }
        });

    };
	
});

router.post('/setProject', (req, res)=>{

    const project = req.body.project;
    project.profileID = req.user.profileID;
    
    if(req.isAuthenticated()){

        var searchQuery = {
            'name': project.name,
            'profileID': project.profileID
        };

        var options = {
            upsert: true
        };

        Project.findOneAndUpdate(searchQuery, project, options, function (err, project) {
            if (err){
                console.log(err);
                res.status(404).send(err);
            } else {
                res.json(project);
            }
        });

    };
	
});

router.post('/removeProject', (req, res)=>{

    const projectName = req.body.projectName;
    const profileID = req.user.profileID;
    
    if(req.isAuthenticated()){

        var searchQuery = {
            'name': projectName,
            'profileID': profileID
        };

        Project.deleteOne(searchQuery, function (err, project) {
            if (err){
                console.log(err);
                res.status(404).send(err);
            } else {
                console.log(project);
                res.json(project);
            }
        });

    };
	
});

module.exports = router;