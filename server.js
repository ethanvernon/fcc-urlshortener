'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var MongoClient = mongo.MongoClient;
require('dotenv').config();
var cors = require('cors');
var app = express();
var port = process.env.PORT;

app.use(cors());
app.use(bodyParser.urlencoded({extended: 'false'}));
app.use(bodyParser.json());
app.use('/public', express.static(process.cwd() + '/public'));
app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

/** this project needs a db !! **/ 
//mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, dbName:'test.people'});

//use connect method to connect to MongoDb server
MongoClient.connect(process.env.MONGO_URI, function(err, db) {
	if (err) {
		console.log('unable to connect to database. Error: ' + err);
	} else {
		console.log('Connection established');

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



		app.post('/api/shorturl/new', function(req,res) {

			//get the url from the form
			var newUrl=req.body.url;	

			//make the object
			var urlToShorten = new ShortUrl({
				original_url: newUrl, 
				short_url:1
			});

			//open the collection
			//var collection=db.collection('links');
			var collection=db.db("FCC").collection("links");

			//save the new object
			collection.save(urlToShorten, err => {
				if (err) {
					console.log("error to databse: " + err);
				}
			});

			//show new object
			return res.json({urlToShorten});
			
		});

	}
});












/*make schema/model for a shortened url
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

var ShortUrl = mongoose.model('ShortUrl', urlSchema);*/


/*get info from post request
app.post('/api/shorturl/new', function(req,res) {
	//get the url from the form
	var newUrl=req.body.url;	

	//make the object
	var urlToShorten = new ShortUrl({
		original_url: newUrl, 
		short_url:1
	});

	//open the collection
	var collection=db.collection('links');

	//save the new object
	collection.insert(urlToShorten, err => {
		if (err) {
			return res.send("error to databse: " + err);
		}
	});

	//show new object
	return res.json({urlToShorten});
	
});*/



// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});