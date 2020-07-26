//loom_manager
// --- client ( a clone of the serverside client object )
// --- strand manager ( managing rendering concerns for the strands )
// --- ui_manager?

function loom_manager(){
	var loom = this // so that we can refer to this object when we're in callback hell
	this.story_id = document.URL.split("/").last().split("?")[0]
	this.client = {}
	this.others = []

	this.connect_socket = function(client){
		var current_passage = SugarCube.Story.get(SugarCube.State.passage).domId
		this.client = client
		this.change_page({content:{id:current_passage}})
	}

	this.change_page = function(ev){
		var old_passage_id = this.client.current_passage_id
		this.client.current_passage_id = ev.content.id
		var event = {
			"story_id": this.story_id, 
			"old_passage_id":old_passage_id,
			"new_passage_id":this.client.current_passage_id,
			"client_id":this.client._id,
			"time":Date.now()
		}
		console.log(event)
		this.socket.emit("nav_event", event)
	}

	this.new_room = function(data){
		this.others = data
	}

	this.socket = io(`/tw/${this.story_id}`)



	this.socket.on("connect_ok", function(data){
		loom.connect_socket(data)
	})

	this.socket.on("nav_event_follow_up", function(data){
		console.log("new here")
		loom.new_room(data)
	})

	this.socket.on("client_leaves", function(data){
		console.log("autumn")
		console.log(data)
	})

	this.socket.on("client_arrives", function(data){
		console.log("new friend")
		console.log(data)
	})

	
}



$(document).ready(function(){
	var loom = new loom_manager()
	console.log(loom)

	$(document).on(":passagestart",function(ev){
		loom.change_page(ev)
	})
})
