const mongoose = require('mongoose');
var ShortId = require('mongoose-shortid-nodeps')

mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Database Connected")
});


const StorySchema = new mongoose.Schema({
	//using short id since we don't expect a large number of stories, but want their index to be url friendly.
	title: String,
	raw_text: String,
	passages: [{
		passage_id:String,
		title:String,
		position:String,
		size:String,
		links:[String]
	}],
	clients: [mongoose.ObjectId],
	events: [mongoose.ObjectId]
})

//instance methods:
//static methods: 
//query  methods:


const StoryModel = mongoose.model("Story", StorySchema)


exports.StoryModel = StoryModel