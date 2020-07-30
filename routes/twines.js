var express = require('express');
var fs = require('fs')

var models = require("../models.js")
const uname_utils = require("../username_utils.js")


var router = express.Router();

function getTwineRouter(io,sharedsession){

	/* GET users listing. */
	router.get('/:twine_id', function(req, res, next) {
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
						lodash_inject = `<script src="/javascripts/lodash.js"></script>`
						socketio_inject = '<script src="/javascripts/socket.io.js"></script>'
						raw_twine = doc[0].raw_text
						raw_twine = raw_twine.replace('{LOOM_JS}', LOOM_JS)
						raw_twine = raw_twine.replace('{LOOM_CSS}', LOOM_CSS)
						raw_twine = socketio_inject+raw_twine
						raw_twine = lodash_inject+raw_twine
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

		socket.on("get_client", function(client){
			var story_id = socket.nsp.name.split("/")[2]
			var session_id = socket.handshake.sessionID 
			//if client is null then it's a new browser session
			if(client == null){
				//there will be another case for logged in users
				models.ClientModel.findOne({session:socket.handshake.sessionID, story_id:story_id}, function(err, docs){
					if(err){
						console.log(err)
					}
					if(docs==null){
						client = new models.ClientModel({story:story_id, session:session_id, current_passage_id:"null", name:uname_utils.random_name()})
						client.save()
						socket.emit("got_client", client)
					}
					else{

					}
				
				})
			}
			else{
				//for reconnection
				models.ClientModel.findOne({_id:client._id}, function(err, client){
					client.session = session_id //the session id might have changed- update it!
					client.save()
					socket.emit("got_client", client)
					//make sure they re-join the room they're meant to be in
					socket.join(client.current_passage_id)
				})
			}	
		})
		
		//whenever a navigation event occurs i.e. user changes what passage they're viewing
		socket.on("nav_event", function(event){
			//store the nav event 
			ev = new models.EventModel(event)
			ev.save()

			//grab the client and update it
			models.ClientModel.findOne({_id:event.client_id}, function(err, this_client){
				if(err){console.log(err)}
				

				//find all the other clients at this location
				models.ClientModel.find({current_passage_id:event.new_passage_id}).exec(function(err, others){
					if(err){console.log(err)}
					socket.emit("nav_event_follow_up",others)

					this_client.current_passage_id = event.new_passage_id
					this_client.save()

					//update client room membership
					socket.leave(event.old_passage_id)
					socket.join(event.new_passage_id)

					//send update events to appropriate rooms. 
					socket.to(event.old_passage_id).emit("client_leaves", this_client)
					socket.to(event.new_passage_id).emit("client_arrives", this_client)

				})	
			})	
		})


		socket.on("disconnect", function(event){
			var session_id = socket.handshake.sessionID
			models.ClientModel.findOne({session:socket.handshake.sessionID}, function(err, client){
				if(client!=null){

					var old_passage_id = client.current_passage_id
					
					client.current_passage_id = "None"
					client.save()
					
					ev = new models.EventModel({
						story_id:socket.nsp.name.split("/")[2],
						client_id:client._id,
						time:Date.now(),
						old_passage_id:old_passage_id,
						new_passage_id:"None"
					})
					ev.save()

					socket.to(old_passage_id).emit("client_leaves", client)
				}else{
					console.log(err)
				}
			})
		})

	})

	return router

}

module.exports = getTwineRouter;
