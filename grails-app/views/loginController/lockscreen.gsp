<%@ page import="cr.sa.bl.User"%>
<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="">
    <meta name="pageActive" content="profile" />
    <meta name="navActive"  content="me" />
    <title><g:message code="auth.lockScreen"/></title>
    
    <link rel="shortcut icon" href="${resource(dir: 'images',                  file: 'favicon.ico')}" type="image/x-icon">
    <link rel="stylesheet"    href="${resource(dir: 'css/plugins/bootstrap',   file: 'bootstrap.min.css')}" type="text/css">
    <link rel="stylesheet"    href="${resource(dir: 'css/plugins/bootstrap',   file: 'bootstrap-reset.min.css')}" type="text/css">
    <link rel="stylesheet"    href="${resource(dir: 'assets/font-awesome/css', file: 'font-awesome.min.css')}" type="text/css"/>
    <link rel="stylesheet"    href="${resource(dir: 'css',                     file: 'style.min.css')}"/>
    <link rel="stylesheet"    href="${resource(dir: 'css/plugins/responsive',  file: 'style-responsive.min.css')}"/>
    
    <script src="<g:createLinkTo dir='js/plugins/jquery/min'    file='jquery-2.1.4.min.js'/>" ></script>    
    <script src="<g:createLinkTo dir='js/plugins/bootstrap'     file='bootstrap.min.js' />"></script>
    <script src="<g:createLinkTo dir='js/layout'                file='lockScreenController.js' />"></script>
    <script src="<g:createLinkTo dir='assets/toastr/build'      file='toastr.min.js' />"></script>
    <script src="<g:createLinkTo dir='js/plugins/template'      file='ejs_production.js' />"></script>
    <script src="<g:createLinkTo dir='js/plugins/backbone'      file='lodash.min.js' />"></script>
    <script src="<g:createLinkTo dir='js/plugins/backbone'      file='backbone-min.js' />"></script>
    <script src="<g:createLinkTo dir='js/layout/sessionUser' file='sessionUserModel.js' />" type="text/javascript"></script>
    
    <script type="text/javascript">
        var urlLanguage = '/blueloop-backend/static/js_i18n/messages_' + '<%= session.getAttribute("lang") %>' + '.json';
        var json;
        $.getJSON(urlLanguage).done(function(parsedResponse) {
            localStorage.setItem('jsLanguage',JSON.stringify(parsedResponse));
        }).fail(function(jqXhr) {
            console.log( "Error getting i18n JSON file, check new messages entered" );
        });
        json = JSON.parse(localStorage.getItem('jsLanguage'));
        $(window).load(function() {
            $(".se-pre-con").fadeOut("fast");   // Animate loader off screen
        });

        <sec:ifLoggedIn>
        var sessionUser = new sessionUserModel({ 
            id:        ${sec.loggedInUserInfo(field: 'id')},
            username: "${sec.loggedInUserInfo(field: 'username')}",
            name:     "${sec.loggedInUserInfo(field: 'firstname')}",
            lastname: "${sec.loggedInUserInfo(field: 'lastname')}",
            role:     "${sec.loggedInUserInfo(field: 'authorities')}",
            imgURI:   "${grails.util.Holders.config.aws.endpoint}${grails.util.Holders.config.aws.bucketBlAppUsers}/${sec.loggedInUserInfo(field: 'username')}/user/avatar.png"
          });
        </sec:ifLoggedIn>
        
        $().ready(function() {            
            window.realtime = new Realtime();
            realtime.init();
        });
    </script>
</head>
<body onmousemove="lockScreen.resetTimers();" >

     <g:render template="../layouts/lockScreen" />
     
    <script type="text/javascript" src="<g:createLinkTo dir='js/plugins/bootstrap'         file='moment.min.js' />"></script>
    <script type="text/javascript" src="<g:createLinkTo dir='js/plugins/jquery'            file='jquery.timeago.min.js' />" ></script>
    <script type="text/javascript" src="<g:createLinkTo dir='js/plugins/jquery/min'        file='jquery.multi-select.min.js' />"></script><%--used by ChatController.js--%>
    <script type="text/javascript" src="<g:createLinkTo dir='js/plugins/jquery/min' file='jquery.nicescroll.min.js' />"></script>
    <script type="text/javascript" src="https://cdn.pubnub.com/pubnub-3.7.22.min.js"></script>
    <script type="text/javascript" src="<g:createLinkTo dir='js/plugins/jquery/min'         file='jquery.dcjqaccordion.2.7.min.js' />"></script>
    <script type="text/javascript" src="<g:createLinkTo dir='js/plugins/datatables'         file='datatables.min.js' />"></script>
    <script type="text/javascript"  src="<g:createLinkTo dir='js/layout'                    file='RealtimeController.js' />"></script>
    <script src="<g:createLinkTo dir='js/layout/chat/chatWindow'      file='chatWidgetModel.js' />"></script>
    <script src="<g:createLinkTo dir='js/layout/chat/chatWindow'      file='chatWidgetCollection.js' />"></script>
    <script src="<g:createLinkTo dir='js/layout/chat/chatWindow/view' file='chatWidgetSingleChatView.js' />"></script>
    <script src="<g:createLinkTo dir='js/layout/chat/chatWindow/view' file='chatWidgetGroupChatView.js' />"></script>
    <script src="<g:createLinkTo dir='js/layout/chat/chatWindow/view' file='dropDownChatView.js' />"></script>
    <script src="<g:createLinkTo dir='js/layout/chat/chatWindow/view' file='chatContactListView.js' />"></script>
    <script src="<g:createLinkTo dir='js/layout'                      file='ChatController.js' />"></script>

    <%--        Backbone Chat--%>
    <script src="<g:createLinkTo dir='js/layout/newUIChat'      file='singleChatModel.js' />" ></script>
    <script src="<g:createLinkTo dir='js/layout/newUIChat'      file='singleChatCollection.js' />"></script>
    <script src="<g:createLinkTo dir='js/layout/newUIChat'      file='groupChatModel.js' />"></script>
    <script src="<g:createLinkTo dir='js/layout/newUIChat'      file='groupChatCollection.js' />"></script>
    <script src="<g:createLinkTo dir='js/layout/newUIChat/view' file='singleChatView.js' />"></script>
    <script src="<g:createLinkTo dir='js/layout/newUIChat/view' file='groupChatView.js' />"></script>
    <script src="<g:createLinkTo dir='js/layout/newUIChat/view' file='chatCategoryView.js' />"></script>
    <script src="<g:createLinkTo dir='js/layout/newUIChat/view' file='chatPanelView.js' />"></script>
      
    <script src="<g:createLinkTo dir='js/layout' file='commonScripts.js' />" ></script>
</body>
</html>
