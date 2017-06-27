var lockScreen = {
	// Set timeout variables.
	timoutWarning: 800000, // Display warning in 1 Mins.
	timoutNow:     900000,      // Timeout in 15 mins. 60000(2 minutos) 900000(15 minutos)
	warningTimer:  0,
	timeoutTimer:  0,
	authAjax:      $("#authAjax"), //instancia del objeto - para cuando presionan enter
	inputPassword: $("#lockedPassword"), //instancia del objeto - para cuando presionan enter
	onLogin:       "",
	// Start timers.
	startTimers: function() {
		var lockState = this.getEstado();
		this.warningTimer = setTimeout(this.idleWarning, this.timoutWarning);
		if(lockState == "inactive"){
			this.timeoutTimer = setTimeout(this.idleTimeout, this.timoutNow);
		}
	},
	
	// Reset timers.
	resetTimers: function () {
		clearTimeout(this.warningTimer);
		clearTimeout(this.timeoutTimer);
	    this.startTimers();
	},
	
	// Si se quisiera poner un mensaje un minuto antes de que se va a bloquear la pantalla
	idleWarning: function () {
		//toastr.error("La sesión se va a bloquear");
	},
	
	// Se bloquea la pantalla después de 15 minutos de inactividad(no se mueve el mouse)
	idleTimeout: function () {
	    if(sessionUser.get("id")== 3 && sessionUser.get("pubnubChannel") == "BlueloopRealtimeDev"){
	        return;
	    }
	    
		localStorage.setItem('lockScreenState', "active");
		startTime();

		if(window.location.pathname != "/blueloop-backend/login/lockscreen"){
			localStorage.setItem('lockPathname', window.location.pathname);
			window.location.replace("/blueloop-backend/login/lockscreen")
		}
		realtime.setUuidState(sessionUser.get("pubnubChannel"), {"id":sessionUser.get("id"),"status":"Away"});
	},
	
	// Para saber si la ventana de bloqueo está activa o no al recargar la página
	getEstado: function(){
		var lockScreenState = localStorage.getItem('lockScreenState');
		return lockScreenState
	},
	
	// Para saber si la ventana de bloqueo está activa o no al recargar la página - inicia el keypress del input del password
	valState: function(){
		var lockState = this.getEstado();
		if(lockState == "active"){
			this.idleTimeout();
		}
	} 
}



/*
 * 
 * */

function startTime() {
	var today = new Date();
	var h = today.getHours();
	var m = today.getMinutes();
	var s = today.getSeconds();
	// add a zero in front of numbers<10
	m = checkTime(m);
	s = checkTime(s);
	document.getElementById('time').innerHTML = h + ":" + m + ":" + s;
	t = setTimeout(function() {
		startTime()
	}, 500);
}

function checkTime(i) {
	if (i < 10) {
		i = "0" + i;
	}
	return i;
}

/* Ajax Login */
var onLogin;
$.ajaxSetup({ 
	beforeSend : function(xhr, event) { 
				// save the 'success' function for later use 
				onLogin = event.success; 
	}, 
	statusCode: { 
					// Set up a global AJAX error handler to handle the 401 unauthorized responses.
					// If a 401 status code comes back, the user is no longer logged-into the system and can not use it properly. 
					401: function() { 
						showLogin(); 
					} 
				} 
});

function showLogin() { 
	lockScreen.idleTimeout();
}

function authAjax() { 
	$('#loginMessage').html('Sending request ...').show();
	
	var form = $('#ajaxLoginForm'); 
	var config = { 
		type : 'post' ,
		url : form.attr('action') ,
		data : form.serialize() ,
		async : false ,
		dataType : 'JSON' ,
		success: function(response) {
			if (response.success) { 
				form[0].reset(); 
				$('#loginMessage').empty(); 

				window.location.replace(localStorage.getItem('lockPathname'))
				localStorage.setItem('lockScreenState', "inactive");
				realtime.setUuidState(sessionUser.get("pubnubChannel"), {"id":sessionUser.get("id"),"status":"Online"}); 
			} else { 
				$('#loginMessage').html("<span class='errorMessage'>" + response.error + '</error>'); 
			}
				
			if (onLogin) { 
				// execute the saved event.success function 
				onLogin(response); 
			} 
		} ,
		error : function (response) { 
				$('#loginMessage').html("error");
				var responseText = response.responseText || '[]'; 
				var json = responseText.evalJSON(); 
				if (json.error) { 
					$('#loginMessage').html("<span class='errorMessage'>" + json.error + '</error>'); 
				} else { 
					$('#loginMessage').html(responseText); 
				} 
		} ,
		beforeSend : function(xhr, event) { 
				//console.log("overriding default behaviour"); 
		} 
	} 
	$.ajax(config); 
}

$(function() { 
	$('#authAjax').click(authAjax); 
	
	$("#lockedPassword").keypress(function(event){
		if(event.which == 13){
			authAjax();
		}
	});
});




