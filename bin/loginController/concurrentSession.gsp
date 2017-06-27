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
                                                            <br/>
                                                            <br/>
                                                            <div class="control-group">
                                                                <div class="controls">
                                                                    <div class="form-control msg-concurrent">
                                                                        <g:message code="auth.concurrentSession"/>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <br/>
                                                            <br/>
                                                                <g:link controller="login" action="auth" class="btn pull-right btn-concurrent">
                                                                    <g:message code="auth.loginPage"/>
                                                                </g:link>
                                                        </form>
                                                    </div>
                                                </div>
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
    </body>
</html>
