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
	if(err){
		console.log(err)
	}
	else{
		process_twine(data, function(processed){
			new_story = new models.StoryModel(processed)
			console.log(new_story._id)
			new_story.save()
			console.log("Uploaded default twine")
		})
	}
	
})
