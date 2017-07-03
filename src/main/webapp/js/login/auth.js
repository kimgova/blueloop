$(function() {
    $body = $("body");
    $(document).on({
        ajaxStart : function() {
            $body.addClass("loading");
        },
        ajaxStop : function() {
            $body.removeClass("loading");
            showloader = true;
        }
    });

    $("#forgot_pass_btn").click(function() {
        $('#forgotmessage').html("");
        $('.back').removeClass('div_hide');
        $('#flip-toggle').addClass('flip');
        $('.front').addClass('div_hide');
        $('#emailResetPassword').focus();
        $('#emailResetPassword').val("");
    });

    $("#submit").click(function() {
        localStorage.setItem('lockScreenState', "inactive");
    });

    $('#loginForm').keypress(function(e) {
        if (e.which == 13) {
            localStorage.setItem('lockScreenState', "inactive");
        }
    });

    $("#send").click(function() {
        $('#forgotmessage').html("");
        if(validateEmail($("#emailResetPassword").val())){
            forgotPass_email();
        }else{
            $('#forgotmessage').html("Please enter a valid email address");
        }
    });

    $("#cancel").click(function() {
        $('#flip-toggle').removeClass('flip');
        $('.front').removeClass('div_hide');
    });

    $('input').iCheck({
        checkboxClass : 'icheckbox_square-blue',
        radioClass : 'iradio_square-blue',
        increaseArea : '20%' // optional
    });

    $("#username").focus();

});

function forgotPass_email() {
    var result = $.ajax({
        type : 'POST',
        url : '/blueloop/login/resetPassword/',
        data : JSON.stringify({
            email : $('#emailResetPassword').val()
        }),
        contentType : "text/json",
        dataType : "json",
        async : false,
        success : function(data) {
            if (data.error) {
                $('#forgotmessage').html(data.error);
            } else {
                $('#forgotmessage').html("A new password was sent to the email address");
            }
        },
        error : function(httpRequest, textStatus, errorThrown) {
            console.log("status=" + textStatus + " ,error=" + errorThrown);
        }
    });
    return true
}

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}