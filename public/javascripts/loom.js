//loom_manager
// --- client ( a clone of the serverside client object )
// --- strand manager ( managing rendering concerns for the strands )
// --- ui_manager

function loom_manager(){
	this.story_id = document.URL.split("/").last().split("?")[0]
	//populated by server after socket connection
	this.client = {
		null:null
	}

	this.socket = io(`/tw/${this.story_id}`)
	this.socket.on("connect", function(){
		console.log("we connected")
	})

	this.page_change = function(event){
		console.log(event)
	}
}



$(document).ready(function(){
	var loom = new loom_manager()
	console.log(loom)

	$(document).on(":passagestart",function(ev){
		loom.page_change(ev)
	})
})