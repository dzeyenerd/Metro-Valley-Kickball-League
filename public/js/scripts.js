$( document ).ready(function() {
 
	$( "#showEdit" ).click(function() {
	  $( ".profileInfo" ).addClass("hide");
	  $( ".editProfile" ).removeClass("hide");
	});

	$( "#updatePhoto" ).click(function() {
	  $( "#updatePhoto" ).addClass("hide");
	  $( ".photoForm" ).removeClass("hide");
	});

	$( "#cancel" ).click(function() {
	  $( "#updatePhoto" ).removeClass("hide");
	  $( ".photoForm" ).addClass("hide");
	});

	$( "#profileCancel" ).click(function() {
	  $( ".profileInfo" ).removeClass("hide");
	  $( ".editProfile" ).addClass("hide");
	});

});