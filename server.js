'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var MongoClient = mongo.MongoClient;
var app = express();
var port = process.env.PORT;
var cors = require('cors');
require('dotenv').config();

app.use(cors());
app.use(bodyParser.urlencoded({extended: 'false'}));
app.use(bodyParser.json());
app.use('/public', express.static(process.cwd() + '/public'));

//serve static file at / and /index.html
app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

//use connect method to connect to MongoDb server
MongoClient.connect(process.env.MONGO_URI, function(err, db) {
	if (err) {
		//if can't connect log error
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

		//post request from form in index.html
		app.post('/api/shorturl/new', function(req,res) {

			//get the url from the form
			var newUrl=req.body.url;

			//open the collection from db atlas
			var collection=db.db("FCC").collection("links");

			//check if the url is in the right format


			//check if the url is in the database already and return the shortened one if so
			var findExistingEntry = collection.findOne(
			    { original_url: newUrl },
			    { original_url: 1, short_url: 1}
			).then(function(data) {
				if (data) {
					console.log('already here');
					console.log(data);
					console.log(data.short_url);
					return res.send({original_url: data.original_url, short_url: data.short_url});
				} else {
					//make the object to store
					var urlToShorten = new ShortUrl({
						original_url: newUrl, 
						short_url:1
					});

					//save the new object
					collection.save(urlToShorten, err => {
						if (err) {
							console.log("error to databse: " + err);
						}
					});

					//show new object in browser
					return res.send({original_url:urlToShorten.original_url, short_url:urlToShorten.short_url});
				}
			});

			/*if (findExistingEntry) {
				console.log('already here');
				console.log(findExistingEntry);
				console.log(findExistingEntry.short_url);
			} else {
				//make the object to store
				var urlToShorten = new ShortUrl({
					original_url: newUrl, 
					short_url:1
				});

				//save the new object
				collection.save(urlToShorten, err => {
					if (err) {
						console.log("error to databse: " + err);
					}
				});

				//show new object in browser
				return res.send({original_url:urlToShorten.original_url, short_url:urlToShorten.short_url});
			}*/


			
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