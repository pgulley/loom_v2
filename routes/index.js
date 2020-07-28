var express = require('express');
var router = express.Router();

var models = require("../models.js")


function getIndexRouter(io,sharedsession){
	//get the index page
	router.get('/', function(req, res, next) {
		//find all, for now. 
		console.log(req.session)
		console.log(req.session.logged_in)
		if(req.session.logged_in == true){
			models.UserModel.findOne({_id:req.session.user}, function(err, user){
				models.StoryModel.find({}).exec(function(err, docs){
					res.render('index', { title: 'home', Story_List:docs, logged_in:true, user:user.username});
				})
			} )
		}else{
			//some stories are public
			models.StoryModel.find({}).exec(function(err, docs){
				res.render('index', { title: 'home', Story_List:docs, logged_in:false});
			})
		}

	});

	router.post("/login", function(req,res){
		const credentials = req.body
		models.UserModel.findOne({username:credentials.username}, function(err, user){
				if(user != null){
					user.comparePassword(credentials.password, function(err, match){
						if(match){
							req.session.logged_in = true
							req.session.user = user._id
							console.log(req.session)
							res.send({status:"OK"})
							
						}else{
							res.send({status: "FAIL", error:"Bad Credentials"})
						}
					})
				}else{
					res.send({status: "FAIL", error:"Bad Credentials"})
				}
			})
	})

	router.get("/logout", function(req, res, next){
		req.session.logged_in = false
		req.session.user = undefined
		res.redirect("/")
	})

	index_sockets = io.of("/index")
	index_sockets.use(sharedsession)
	index_sockets.on("connection", function(socket){
		
		//when an outside user tries to 'create' a user
		socket.on("attempt_create",function(credentials){
			//check uname not dup
			//create
		})


		//create story
		

	})


	return router

}

module.exports = getIndexRouter;
