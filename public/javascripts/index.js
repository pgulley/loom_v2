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
		var uname = $("#create_uname").val()
		var pass = $("#create_pword").val()
		if(uname!="" && pass!=""){
			socket.emit("attempt_create", {username:uname, password:pass})
		}else{
			$("#login_errors")[0].innerHTML = "field cannot be empty"
		}
	})

	socket.on("login_response",function(data){
		if(data.status=="OK"){
			$.post({url:"/login", data:data.credentials})
		}else{
			$("#login_errors")[0].innerHTML = data.error
		}
	})

	socket.on("create_response", function(data){
		//if success, refresh
		//if failure, display error
	})

})

