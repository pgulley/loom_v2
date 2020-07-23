var express = require('express');
var fs = require('fs')

var models = require("../models.js")


var router = express.Router();

/* GET users listing. */
router.get('/:twine_id', function(req, res, next) {
	models.StoryModel.find({_id:req.params.twine_id}).exec(function(err, doc){
		fs.readFile("./public/javascripts/loom.js", "utf-8", function(err, LOOM_JS){
			fs.readFile("./public/stylesheets/loom.css", "utf-8", function(err, LOOM_CSS){
				console.log(LOOM_JS)
				raw_twine = doc[0].raw_text
				raw_twine = raw_twine.replace('{LOOM_JS}', LOOM_JS)
				raw_twine = raw_twine.replace('{LOOM_CSS}', LOOM_CSS)
				console.log(LOOM_CSS)
				console.log(raw_twine == doc[0].raw_text)
				res.send(raw_twine);
			})
		})
	})
});

module.exports = router;
