var express = require('express');
var router = express.Router();

var processTwine = require("../process_twine.js")
var models = require("../models.js")

function getIndexRouter(io,sharedsession){
	//get the index page
	router.get('/', function(req, res, next) {
		if(req.session.logged_in == true){
			models.UserModel.findOne({_id:req.session.user}, function(err, user){
				user.getStories(function(docs){
					if(user.admin){
						models.UserModel.find({}).exec(function(err, all_users){
							res.render('index', { title: 'home', Story_List:docs, logged_in:true, user:user, all_users:all_users});
						})
					}else{
						res.render('index', { title: 'home', Story_List:docs, logged_in:true, user:user});
					}
				})
			} )
		}else{
			//some stories are public
			models.StoryModel.find({access:"public"}).exec(function(err, docs){
				res.render('index', { title: 'home', Story_List:docs, logged_in:false});
			})
		}

	});

	//upload and validate new twine stories
	router.post("/create_new_story", function(req,res){
		const story = req.body
		processTwine.validateTwine(story.raw_twine, function(errs, raw){
			if(errs.length > 0){
				res.send({status:"FAIL", errors:errs})
			}else{
				processTwine.processTwine(raw, function(processed){
					new_story = new models.StoryModel(processed)
					new_story.access = story.access_scheme
					new_story.author = req.session.user
					models.UserModel.findOne({_id:req.session.user}, function(err, user){
						user.stories.push({story_id:new_story._id, admin:true})
						user.save(function(err){
							new_story.save(function(err){
								res.send({status:"OK"})
							})
						})
					})
				})
			}
		}) 
	})

	router.post("/login", function(req,res){
		const credentials = req.body
		models.UserModel.findOne({username:credentials.username}, function(err, user){
				if(user != null){
					user.comparePassword(credentials.password, function(err, match){
						if(match){
							req.session.logged_in = true
							req.session.user = user._id
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

	router.post("/create_user", function(req,res){
		const credentials = req.body
		var new_user = new models.UserModel({username:credentials.username, password:credentials.password})
		new_user.save(function(err){
			if(err){
				res.send({status:"FAIL", error:"Username Not Unique"})
			}else{
				if(credentials.log_in){
					req.session.logged_in = true
					req.session.user = new_user._id
				}
				res.send({status:"OK"})
			}
		})
	})

	router.post("/edit_user", function(req, res){
		models.UserModel.findOne({_id:req.body.user_id}).exec(function(err, user){
			switch (req.body.action){
				case "toggle_admin":
					user.admin = !user.admin
					break
			}
			user.save(function(err){
				res.send({status:"OK"})
			})
		})
	})

	router.get("/logout", function(req, res, next){
		req.session.logged_in = false
		req.session.user = undefined
		res.redirect("/")
	})

	//all this may be unnesecary...
	index_sockets = io.of("/index")
	index_sockets.use(sharedsession)
	index_sockets.on("connection", function(socket){
		
	})

	return router

}

module.exports = getIndexRouter;
