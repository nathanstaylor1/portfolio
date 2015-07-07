
$(document).ready(function(){


	$(".toggle").click(function(){

		if ( $("#navbarToggle").hasClass("offScreen") ){

			$("#navbarToggle").toggleClass("moveIn")
			setTimeout(function(){
				$("#navbarToggle div").css("opacity","1")		
				$("#navbarToggle").toggleClass("moveIn")
				$("#navbarToggle").toggleClass("offScreen")	
			},1000)
	
		} else {

			$("#navbarToggle").toggleClass("moveOut")
			setTimeout(function(){
				$("#navbarToggle div").css("opacity","0")	
				$("#navbarToggle").toggleClass("moveOut")
				$("#navbarToggle").toggleClass("offScreen")	
			},1000)

		}

	});

});