'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
require('dotenv').config();

var cors = require('cors');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

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

//get info from post request
app.post('/api/shorturl/new', function(req,res) {
	var newUrl=req.body.url;
	res.json({"test": newUrl});
});

//make schema/model for a shortened url
var Schema = mongoose.Schema;

var urlSchema = new Schema({    
	original_url: {
		type:String,
		unique:true
		}
	short_url: {
		type:Number,
		unique:true
	}
});

var shortUrl = mongoose.model('shortUrl', urlSchema);

//console for port
app.listen(port, function () {
  console.log('Node.js listening ...');
});