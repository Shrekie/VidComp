var mongoose = require('mongoose');

const options = {
    useNewUrlParser: true
};

mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGO_URL, options, (err)=>{
    if(err){
        console.log('Could not connect to database: ', err);
    }
    else{

        console.log('Connected to database: ');
    }
});

module.exports = {mongoose};