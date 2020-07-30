const mongoose = require('mongoose');
const bcrypt = require("bcrypt")
const _ = require("lodash")
const SALT_WORK_FACTOR = 10

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
	description: String,
	author: mongoose.ObjectId,
	raw_text: String,
	passages: [{
		passage_id:String,
		title:String,
		position:String,
		size:String,
		links:[String]
	}],
	access:{type: String, default: "public"},
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
	username: {type:String, required:true, index:{unique:true}},
	password: {type:String, required:true},
	clients: [mongoose.ObjectId],
	stories:[{
		story_id:mongoose.ObjectId,
		admin:Boolean
	}],
	admin:Boolean
})

UserSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {

    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

UserSchema.methods.getStories = function(cb){
	if(this.admin){
		StoryModel.find({}).exec(function(err, docs){
			cb(docs)
		})
	}
	else{
		var user_stories = _.flatMap(this.stories, function(s){return s.story_id})
		if(user_stories.length > 0){
			//get every public story, then also every story that this user has access to.
			StoryModel.find({$or: [{access:["public","semi"]} , {  _id:[user_stories] }] }).exec(function(err, docs){
				cb(docs)
			})
		}else{
			StoryModel.find({access:["public","semi"] }).exec(function(err, docs){
				cb(docs)
			})
		}
		
	}
}

const UserModel = mongoose.model("User", UserSchema)

exports.StoryModel = StoryModel
exports.ClientModel = ClientModel
exports.EventModel = EventModel
exports.UserModel = UserModel