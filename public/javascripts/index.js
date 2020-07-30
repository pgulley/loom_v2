$(window).ready(function(){
	var socket = io("/index")
	socket.on('connect', function() {
		console.log("connected!")
	})

	$('#login_modal').modal({"show":false})

	$(".login_button").click(function(){
		console.log("button")
		$('#login_modal').modal("show")
	})

	$("#login_user").click(function(){
		$("#login_errors")[0].innerHTML =  ""
		var uname = $("#uname").val()
		var pass = $("#pword").val()
		if(uname!="" && pass!=""){
			$.post("/login", {username:uname, password:pass})
			.then(function(data){
				if(data.status=="OK"){
					location.reload()
				}else{
					$("#login_errors")[0].innerHTML = data.error
				}
			})
		}else{
			$("#login_errors")[0].innerHTML = "field cannot be empty"
		}
	})

	$("#create_user").click(function(){
		$("#create_user_errors")[0].innerHTML = ""
		var uname = $("#create_uname").val()
		var pass = $("#create_pword").val()
		if(uname!="" && pass!=""){
			$.post("/create_user", {username:uname, password:pass, log_in:true})
			.then(function(data){
				if(data.status=="OK"){
					location.reload()
				}else{
					$("#create_user_errors")[0].innerHTML = data.error
				}
			})
		}else{
			$("#create_user_errors")[0].innerHTML = "field cannot be empty"
		}
	})

	$(document).on("click", "#submit_new_twine", function(){
		$("#upload_errors")[0].innerHTML = ""
		var fr = new FileReader
		fr.onload = function(e){
			var auth_scheme = $("select[name='access']").val()
			var raw_twine = e.target.result
			//probably ajax instead of socket, right? for this application?
			$.post("/create_new_story", {"raw_twine":raw_twine, "access_scheme":auth_scheme })
			.then(function(data){
				if(data.status=="OK"){
					location.reload()
				}else{
					$("#upload_errors")[0].innerHTML = data.errors.join("</br>")
				}
				console.log(data)
				//something got returned
			})
		}
		var twine_file = $("#upload_new_twine").prop("files")[0]
		var story_id = twine_file.name.split(".")[0]
		fr.readAsText(twine_file)
	})
})

