var express = require('express');
var router = express.Router();

var models = require("../models.js")


function getIndexRouter(io,sharedsession){
	//get the index page
	router.get('/', function(req, res, next) {

		//find all, for now. 
		models.StoryModel.find({}).exec(function(err, docs){
			res.render('index', { title: 'home', Story_List:docs });
		})
	});

	return router

}

module.exports = getIndexRouter;
