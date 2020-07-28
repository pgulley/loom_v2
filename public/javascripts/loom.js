//loom_manager
// --- client ( a clone of the serverside client object )
// --- strand manager ( managing rendering concerns for the strands )
// --- ui_manager?

function loom_manager(){
	var loom = this // so that we can refer to this object when we're in callback hell
	this.story_id = document.URL.split("/").last().split("?")[0]
	this.client = null
	this.others = []

	this.get_client = function(){
		loom.socket.emit("get_client", this.client)
	}

	this.got_client = function(client){
		var current_passage = SugarCube.Story.get(SugarCube.State.passage).domId
		if(this.client == null){
			this.client = client
			this.change_page({content:{id:current_passage}})
		}else{
			this.client = client
			//no need to nav if the server is just reconnecting
		}
		
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
		this.socket.emit("nav_event", event)
	}

	this.new_room = function(data){
		this.others = _.keyBy(data, function(d){
			if(d._id != loom.client._id){
				return d._id
			}
		})
	}

	this.client_arrives = function(data){
		if(data._id != this.client._id){
			this.others[data._id] = data
		}
	}

	this.client_leaves = function(data){
		delete this.others[data._id]
	}

	//----- keep ui concerns separate from the actual object functions

	this.main_wrapper = function(){
		var t_ = `<div class="loom_ui"> </div>`
		return t_

	}
	this.debug_ui = function(){
		var t_ = `
			<div class="temp_ui">
			<h3> ${loom.client.name} </h3>
			<ul> ${_.map(loom.others, function(c){
				return `<li> ${c.name} </li>` 
			}).join("")}
			</ul>
			</div>
		` 
		return t_
	}

	this.do_debug_ui = function(){
		$(".loom_ui").empty().append(loom.debug_ui())
	}

	//----- keep the socket routing separated from the actual object functions

	this.socket = io(`/tw/${this.story_id}`)

	this.socket.on("connect", function(data){
		//console.log("connect")
		loom.get_client()
	})

	this.socket.on("got_client", function(data){
		//console.log("got_client")
		loom.got_client(data)
	})

	this.socket.on("nav_event_follow_up", function(data){
		//console.log("nav_event_follow_up")
		loom.new_room(data)
	})

	this.socket.on("client_leaves", function(data){
		//console.log("client_leaves")
		loom.client_leaves(data)
	})

	this.socket.on("client_arrives", function(data){
		//console.log("client_arrives")
		loom.client_arrives(data)
	})

	//---- final setup
	$("body").append(this.main_wrapper())

}


function templates(loom_manager){
	this.loom = loom_manager
	
}


var loom = null
$(document).ready(function(){
	loom = new loom_manager()

	$(document).on(":passagestart",function(ev){
		loom.change_page(ev)
	})

	setInterval(loom.do_debug_ui, 1000)
})
