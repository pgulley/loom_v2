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
})

