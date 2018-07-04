var express = require('express');
var router = express.Router();

router.get('/me', (req, res)=>{
	res.json({user:'thomas'});
});

module.exports = router;