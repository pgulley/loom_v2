$(window).ready(function(){
	$('#login_modal').modal({"show":false})

	$(".login_button").click(function(){
		console.log("button")
		$('#login_modal').modal("show")
	})
})
console.log("hiii")

