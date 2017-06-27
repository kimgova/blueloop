$(document).ready(function(){
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
    
    $("#buttonReset").click(function(){
        validatePass();
    });
   
    function validatePass() {
        $("#form_update").validate({
            rules : {
                currentpassword : "required",
                password : {
                    required : true,
                    minlength : 8,
                    pwcheck : true
                },
                password2 : {
                    equalTo : "#password"
                },
            },
            messages : {
                currentpassword : "Please enter your current password",
                password : {
                    required : "Please provide a password",
                    minlength : "Your password must be at least 8 characters long",
                    pwcheck : "Must contain at least one lower case letter, one upper case letter, one digit and one special character"
                },
                password2 : {
                    equalTo : "Please enter the same password as above"
                },
            },
            success : "valid",
            submitHandler : function(form, data) {
                form.submit();
            }
        });
    
        $.validator.addMethod("pwcheck", function(value, element) {
            return /^.*(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=?.!]).*$/.test(value);
        });
    }

});