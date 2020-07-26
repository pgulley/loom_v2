var express = require('express');
var fs = require('fs')

var models = require("../models.js")


var router = express.Router();

function getTwineRouter(io,sharedsession){

	/* GET users listing. */
	router.get('/:twine_id', function(req, res, next) {
		console.log(req.session)
		models.StoryModel.find({_id:req.params.twine_id}).exec(function(err, doc){
			if(err | doc.length == 0){
				res.sendStatus(404)
			}
			else{
				fs.readFile("./public/javascripts/loom.js", "utf-8", function(err, LOOM_JS){
					fs.readFile("./public/stylesheets/loom.css", "utf-8", function(err, LOOM_CSS){
						//The work of inserting new code into the existing twine story happens here. 
						// maybe eventually this should be pre-compiled? there are no reasons it should ever have to change...
						// but while I'm developing, I'll just compile it live. 

						socketio_inject = '<script src="/javascripts/socket.io.js"></script>'
						raw_twine = doc[0].raw_text
						raw_twine = raw_twine.replace('{LOOM_JS}', LOOM_JS)
						raw_twine = raw_twine.replace('{LOOM_CSS}', LOOM_CSS)
						raw_twine = socketio_inject+raw_twine
						res.send(raw_twine);
					})
				})
			}
		})
	});

	router.get("/*.map", function(req, res, next){
		console.log("NO MAPS HERE YET")
		res.sendStatus(404)
	})


	twine_sockets = io.of(/^\/tw\/\S+/gm)
	twine_sockets.use(sharedsession)
	twine_sockets.on("connection", function(socket){
		//the client is uniquely defined by the story id and the user id- 
		// the user id is isomorphic with the session id
		// so if the session id is in the socket def
		// we can identify and or create a client here , and send it back to the browser
		var story_id = socket.nsp.name.split("/")[2]
		console.log(socket.handshake.session)
		console.log(story_id)

	})

	return router

}

module.exports = getTwineRouter;
