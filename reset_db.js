const models = require("./models.js")
const process_twine = require("./process_twine.js")
const fs = require('fs')


models.StoryModel.deleteMany({}, function(){
	console.log("Deleted Stories")
})

models.ClientModel.deleteMany({}, function(){
	console.log("Deleted Clients")
})

models.EventModel.deleteMany({}, function(){
	console.log("Deleted Events")
})

models.UserModel.deleteMany({}, function(){
	console.log("Deleted Users")
})


fs.readFile("twines/twine.html", "utf8", function(err, data){


	admin = new models.UserModel({username:"admin", password:"secret_sauce", admin:true})
	admin.save(function(err){
			console.log("created admin user")
			process_twine(data, function(processed){
			new_story = new models.StoryModel(processed)
	
			new_story.save()
			console.log("Uploaded default twine")
		})
	})
	
})
