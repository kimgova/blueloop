/**
 * Class: edit-profile.js
 * User:  Daniela Salas C.
 * Date:  01/05/14
 * Description: functions for edit profile Module
 * Funtions:
 *  -showMessage: Función que evalua cual mensaje se debe desplegar en la página si el de error en la transacción o el de transacción éxitosa
 *    parametros: data: variable que contiene la respuesta ajax, onSuccess: #id del div a mostrar en caso de exito, onError: #id del div a mostrar en caso de error
 *    
 *  -ajaxCall   : Definida en el index.js se encarga de hacer el llamado al ajax para realizar las transacciones
 */

$(document).ready(function(){
	json = JSON.parse(localStorage.getItem('jsLanguage'));
    validatePass()
    addRuleValidator()
    
    $("#language").keypress(function(event){
    	if(event.which == 13){
    		$("#buttonL").click();
    	}
    });
    $("#email").keypress(function(event){
    	if(event.which == 13){
    		$("#buttonE").click();
    	}
    });
    $("#currentpassword").keypress(function(event){
    	if(event.which == 13){
    		validatePass();
    	}
    });
    $("#password").keypress(function(event){
    	if(event.which == 13){
    		validatePass();
    	}
    });
    $("#password2").keypress(function(event){
    	if(event.which == 13){
    		validatePass();
    	}
    });

    $("#buttonL").click(function(){
        var jsonObject = new Object()
        jsonObject.language = $("#language").find(":selected").val()

        var data = ajaxCall('GET','/blueloop/user/updateL/', jsonObject, "text/json", "json", false);
        
        showMessage(data); 
    });

    $("#buttonE").click(function(){
        var jsonObject = new Object()
        jsonObject.email = $("#email").val()

        var rege = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if(rege.test($('#email').val())){ 
            var data = ajaxCall('GET','/blueloop/user/updateE/',jsonObject, "text/json", "json", false);
            showMessage(data); 
        }else if($('#email').val() == ''){
            showMessage(data,json.error.emailEmpty);
        }else{
            showMessage(data,json.error.emailInvalid);
        }    
    });

    $("#buttonCP").click(function(){
    	validatePass();
    });
      
	$(document).on("change", "#inputFile", function() {
		$("#formUploadUserImage").ajaxSubmit({
            async: true,
            url: "/blueloop/user/uploadFile", 
            beforeSubmit: function() { 
            	$("body").addClass("loading");    
 			},
            success: function (data) {
            	$("body").removeClass("loading");
                $('#general img').attr("src", data.path + data.filename);
		    	$('input[name=fileName]').val(data.filename);
		    	$('input[name=fileNameSelect]').val("");
		    	
		    	$('#user-avatar').attr("src", data.photoUrlUpload + "?" + new Date().valueOf()); 
		    	$('#userAvatar').attr("src", data.photoUrlUpload + "?" + new Date().valueOf());
		    	$('#profile-wrapper-img').attr("src", data.photoUrlUpload + "?" + new Date().valueOf());
		    	$.ajax({type: 'GET', data: {fileName:data.filename}, url: '/blueloop/user/deleteImage/', dataType:"json", success: function(data, textStatus){ } });
		    	document.getElementById('statusDiv').innerHTML = 'Image uploaded: '+data.filename;
		    	toastr.success(data.message);	
            },
            error: function(httpRequest, textStatus, errorThrown) { 
               $("body").removeClass("loading");
 	     	   console.log("status=" + textStatus + " ,error=" + errorThrown);
 	     	   toastr.error(httpRequest.responseJSON.error);
 	     	}
        });

	});

function showMessage(data, onSuccess, onError){
	if (data){
		toastr.success(json.profile.personalInfoSaved);
    }else{
    	toastr.error(json.error.tryAgain);
    } 
}

		
function validatePass(){
	
	$("#formNewPass").validate({
		rules: {
			currentpassword: "required",
			password:{
				required  : true,
				minlength: 8,
				pwcheck: true
			},
			password2:{
				required  : true,
				minlength : 8,
				equalTo   : "#password"
			},
		},
		messages : {
			currentpassword: json.profile.passwordRequired,
			password: {
				required  : json.profile.passwordRequired,
				minlength : json.profile.passwordMinLength,
				pwcheck   : json.profile.passwordContain
			},
			password2: {
				required  : json.profile.passwordRequired,
				minlength : json.profile.passwordMinLength,
				equalTo   : json.profile.passwordEqualTo
			},
		},
		success: "valid",
		submitHandler: function(form,data) {
			changePass();
		}
	});
	
	 $.validator.addMethod("pwcheck",
             function(value, element) {
                 return /^.*(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=?.!]).*$/.test(value);
         });
}

function changePass(){ 
	var jsonObject = new Object()
    jsonObject.password 	= $("#currentpassword").val()
    jsonObject.newPassword 	= $("#password").val()
    
    var data = ajaxCall('GET','/blueloop/user/updateCP/',jsonObject, "text/json", "json", false);

    if(data.loginSuccess == "false"){
        toastr.error(json.profile.passwordError);
    }else{
        toastr.success(json.profile.passwordSuccess);
    }
    $("#password").val("")
    $("#password2").val("")
        
}

function addRuleValidator(){
    $.validator.addMethod("valueNotEquals", function(value, element, arg){
    	  return arg != value;
	}, json.profile.valueEqualArg);
}
});

