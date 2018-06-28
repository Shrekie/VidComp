var express = require('express');
var router = express.Router();

router.get('/app/me/', (req, res)=>{
	res.json({user:'thomas'});
});

module.exports = router;