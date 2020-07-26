const mongoose = require('mongoose');
var ShortId = require('mongoose-shortid-nodeps')

mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Database Connected")
});

//Story Model stores all the data related to an individual twine story
// this includes the title and the raw text
// a schematized representaion of the content in passages
// and a list of all the clients (story-specific user models) and events
const StorySchema = new mongoose.Schema({
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

const StoryModel = mongoose.model("Story", StorySchema)


//Client Model manages user state within a story
// so obvi we store the user and the story
// and a current passage marker
// and a string that can be set for story variables. 
const ClientSchema = new mongoose.Schema({
	story: mongoose.ObjectId,
	user: mongoose.ObjectId,
	session: String,
	name: String,
	current_passage_id: String,
	story_vars: String
})

const ClientModel = mongoose.model("Client", ClientSchema)


//Event Model just tracks story events as they occur.
const EventSchema = new mongoose.Schema({
	story_id: mongoose.ObjectId,
	client_id: mongoose.ObjectId,
	time: mongoose.Date,
	new_passage_id: String,
	old_passage_id: String
})

const EventModel = mongoose.model("Event", EventSchema)

////this is stubbed out according to expectation but not built out yet
const UserSchema = new mongoose.Schema({
	username: String,
	password: String,
	clients: [mongoose.ObjectId],
	stories:[{
		story_id:mongoose.ObjectId,
		admin:Boolean
	}],
	admin:Boolean
})

const UserModel = mongoose.model("User", UserSchema)

exports.StoryModel = StoryModel
exports.ClientModel = ClientModel
exports.EventModel = EventModel
exports.UserModel = UserModel