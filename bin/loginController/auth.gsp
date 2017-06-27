<html>
    <head>
        <meta http-equiv="content-type" content="text/html; charset=UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta charset="utf-8">
        <title><g:message code="auth.welcome"/></title>
        
        <link rel="shortcut icon" href="${resource(dir: 'images', file: 'favicon.ico')}" type="image/x-icon">
        <link rel="stylesheet" href="${resource(dir: 'css/plugins/bootstrap', file: 'bootstrap.min.css')}" type="text/css">
        <link rel="stylesheet" href="${resource(dir: 'css/custom', file: 'main.css')}" type="text/css">
        <link rel="stylesheet" href="${resource(dir: 'assets/font-awesome/css', file: 'font-awesome.min.css')}" type="text/css" media='screen'>
        <link rel="stylesheet" href="${resource(dir: 'assets/iCheck-master/square/', file: 'blue.css')}" type="text/css">

        <r:layoutResources />
    </head>
    <body>
        <div class="background-image"></div>
            <div class="content">
                <div id="wrap">
                    <div class="container-fluid">
                        <div class="row-fluid">
                            <div class="span12">
                                <div class="row-fluid">
                                    <div class="widget container-narrow">
                                        <div class="flip-container" id="flip-toggle">
                                            <div class="flipper">
                                                <!-- #Region Log In            -->
                                                <div class="front" id="login">
                                                    <div class="widget-header">
                                                        <i class="fa fa-user"></i>
                                                        <h5><g:message code="auth.login"/></h5>
                                                    </div>  
                                                    <div class="widget-body clearfix">
                                                          <form action='${postUrl}' method='POST' id='loginForm' autocomplete='off'>
                                                              <div class="logo">
                                                                  <a href="http://blue-loop.com"> 
                                                                      <img alt="Blue-loop" src="/blueloop-backend/static/images/logo.png">
                                                                </a>
                                                              </div>
                                                              <div class="control-group">
                                                                <div class="controls">
                                                                    <i class="fa fa-envelope-o fa-fw"></i>
                                                                    <input class="form-control" type="text" id="inputEmail" placeholder='<g:message code="auth.emailUsername"/>' name='j_username' id='username' autofocus>
                                                                </div>
                                                            </div>
                                                            <div class="control-group">
                                                                <div class="controls">
                                                                     <i class="fa fa-key fa-fw"></i>
                                                                    <input class="form-control" type="password" id="inputPassword" placeholder='<g:message code="auth.password"/>' name='j_password' id='password'>
                                                                </div>
                                                            </div>
                                                            <div class="control-group">
                                                                <div class="controls clearfix">
                                                                    <input type='checkbox' class='chk checkbox pull-left' name='${rememberMeParameter}' id='remember_me' <g:if test='${hasCookie}'>checked='checked'</g:if> />
                                                                    <g:message code="auth.rememberMe"/>
                                                                    <a href="#" class="pull-right flipLink" id="forgot_pass_btn"><g:message code="auth.forgotPassword"/></a>
                                                                </div>
                                                            </div>                    
                                                            <div class="control-group">
                                                                <g:if test='${flash.message}'>
                                                                    <div class='alert alert-danger'>
                                                                        <label>${flash.message}</label>
                                                                    </div>
                                                                </g:if>
                                                                <g:if test='${flash.success}'>
                                                                    <div class="alert alert-success">
                                                                      <strong>Success!</strong> ${flash.success}
                                                                    </div>
                                                                </g:if>
                                                            </div>
                                                            <br/>
                                                            <g:recaptchaLogin/>
                                                            <br/>
                                                            <button type="submit" class="btn pull-right" id="submit"><g:message code="button.login"/></button>
                                                          </form>
                                                    </div>
                                                </div>
                                                <!-- EndRegion Log In          -->
                                
                                                <!-- #Region ForgotPassword    -->
                                                <div class="back" id="recover">
                                                    <div class="widget-header">
                                                        <i class="fa fa-gear"></i>
                                                        <h5><g:message code="auth.forgotPassword"/></h5>
                                                    </div>  
                                                    <div class="widget-body clearfix">
                                                        <form id="forgotPassForm" onsubmit="return false">
                                                            <div class="logo">
                                                                <a href="http://blue-loop.com"> 
                                                                    <img alt="Blue-loop" src="/blueloop-backend/static/images/logo.png">
                                                                </a>
                                                            </div>
                                                            <div class="legendEmail">
                                                                <i class="fa fa-info-circle"></i> <g:message code="message.resetPassword"/>
                                                            </div>
                                                            <div class="control-group">
                                                                <div class="controls">
                                                                    <i class="fa fa-envelope-o"></i>
                                                                    <input type="email" name='emailResetPassword' id='emailResetPassword' placeholder='<g:message code="auth.email"/> ' class="form-control" /> 
                                                                </div>
                                                            </div>
                                                            <div class='login_message'>
                                                                <label id="forgotmessage"></label>
                                                            </div>
                                                            <div class="control-group">
                                                                <div id="send" class="btn pull-right">Send</div>
                                                                <div id="cancel" class="btn pull-right flipLink">Cancel</div> 
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                                <!-- #EndRegion ForgotPassword -->
                                            </div>
                                        </div>
                                </div>
                            </div> <!--row-fluid-->
                        </div> <!--span12-->
                    </div> <!--row-fluid-->
                </div> <!--container-fluid-->
            </div> <!-- wrap ends-->
        </div>
        <div class="modalLoading"></div>
        <script src="<g:createLinkTo dir='js/plugins/jquery' file='jquery-1.10.2.js' />"></script>
          <script src="<g:createLinkTo dir='js/plugins/jquery/min'    file='jquery-ui.min.js'/>"></script>
          <script src="<g:createLinkTo dir='js/plugins/bootstrap' file='bootstrap.min.js' />"></script>
        <script src="<g:createLinkTo dir='assets/iCheck-master/' file='icheck.min.js' />"></script>
        <script src="<g:createLinkTo dir='js/login' file='auth.js' />"></script>
    </body>
</html>
