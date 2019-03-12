'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
require('dotenv').config();

var cors = require('cors');

var app = express();

// Basic Configuration 
var port = process.env.PORT;

/** this project needs a db !! **/ 
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true});


app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(bodyParser.urlencoded({extended: 'false'}));
app.use(bodyParser.json());

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});



//make schema/model for a shortened url
var Schema = mongoose.Schema;

var urlSchema = new Schema({    
	original_url: {
		type:String,
		unique:true
		},
	short_url: {
		type:Number,
		unique:true
	}
});

var ShortUrl = mongoose.model('ShortUrl', urlSchema);


//create a URL
var createShortUrl = function(done, postUrl) {
	console.log('doc create');
	var ToShortUrl = new ShortUrl({original_url: postUrl, short_url:1});
	ToShortUrl.save((err, data) => err ? done(err) : done(null, data));
};

//get info from post request
app.post('/api/shorturl/new', function(req,res) {
	var newUrl=req.body.url;
	console.log(newUrl);
	console.log(createShortUrl);
	createShortUrl(null, newUrl);
	res.json({"test": newUrl});
});

//how to find a url in database
var findOneByOriginal = function(original, done) {
  var searchOriginals = {original_url:original};
  ShortUrl.findOne(searchOriginals, (err, data) => err ? done(err) : done(null, data));
};

//console for port
app.listen(port, function () {
  console.log('Node.js listening ...');
});