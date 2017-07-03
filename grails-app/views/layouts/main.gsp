<!DOCTYPE html>
<!--[if lt IE 7 ]> <html lang="en" class="no-js ie6"> <![endif]-->
<!--[if IE 7 ]>    <html lang="en" class="no-js ie7"> <![endif]-->
<!--[if IE 8 ]>    <html lang="en" class="no-js ie8"> <![endif]-->
<!--[if IE 9 ]>    <html lang="en" class="no-js ie9"> <![endif]-->
<!--[if (gt IE 9)|!(IE)]><!--> <html lang="en" class="no-js"><!--<![endif]-->
<head>
    <meta charset="UTF-8">
    <meta content="utf-8"               http-equiv="encoding">
    <meta name="viewport"               content="width=device-width, initial-scale=1.0">
    <meta name="description"            content="">
    <meta name="author"                 content="Eprom">
    <meta name="keyword"                content="Blue-loop, Dashboard, Bootstrap, supply chain">
    <g:if test = "${csrf}">
    <meta name="_csrf"                  content="${csrf.token_key}"/>
    <meta name="_csrf_header"           content="${csrf.token_uri}"/>
    </g:if>
    <meta http-equiv="Content-Type"     content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible"  content="IE=edge,chrome=1">
    
    <title><g:layoutTitle default="Blue-loop"/></title>
    
    <link rel="shortcut icon" href="${resource(dir: 'images',               file: 'favicon.ico')}" type="image/x-icon">
<%--    <link rel="stylesheet" href="${resource(dir: 'css/plugins/bootstrap',   file: 'bootstrap.min.css')}" type="text/css">--%>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css" type="text/css">
    <link rel="stylesheet" href="${resource(dir: 'css/plugins/bootstrap',   file: 'bootstrap-reset.min.css')}" type="text/css">
    <link rel="stylesheet" href="${resource(dir: 'css/plugins/another',     file: 'breadCrumb.min.css')}" type="text/css" media="screen">
    <link rel="stylesheet" href="${resource(dir: 'assets/font-awesome/css', file: 'font-awesome.min.css')}" type="text/css"/>
    <link rel="stylesheet" href="${resource(dir: 'css',                     file: 'style.min.css')}"/>
    <link rel="stylesheet" href="${resource(dir: 'css/plugins/responsive',  file: 'style-responsive.min.css')}"/>
    <link rel="stylesheet" href="${resource(dir: 'css/custom',              file: 'chat.css')}" type="text/css">
    <link rel="stylesheet" href="${resource(dir: 'css/plugins/jquery',      file: 'jquery-ui.min.css')}" type="text/css">
    <link rel="stylesheet" href="${resource(dir: 'assets/toastr/build',     file: 'toastr.min.css')}" type="text/css">
    <link rel="stylesheet" href="${resource(dir: 'css/plugins/another',     file: 'animate.min.css')}" type="text/css">
    <link rel="stylesheet" href="${resource(dir: 'css/datatable',           file: 'datatables.min.css')}" type="text/css">
    <link rel="stylesheet" href="${resource(dir: 'css/custom', 				file: 'notifSidebar.css')}" type="text/css">
    <link rel="stylesheet" href="${resource(dir: 'css/custom', 				file: 'headerStyle.css')}" type="text/css">
    <link rel="stylesheet" href="${resource(dir: 'css/custom', 				file: 'newUIChat.css')}" type="text/css">
 
    <link rel="stylesheet" href="${resource(dir: 'assets/simple-line-icons-master/css',  file: 'simple-line-icons.css')}" type="text/css">

    <!-- scripts -->
    <script type="text/javascript" src="<g:createLinkTo dir='js/plugins/jquery/min'    file='jquery-2.1.4.min.js'/>" ></script>
<%--    <script type="text/javascript" src="<g:createLinkTo dir='js/plugins/jquery'        file='jquery-migrate-1.2.1.min.js'/>" ></script>--%>
    <script type="text/javascript" src="<g:createLinkTo dir='js/plugins/jquery/min'    file='jquery-ui.min.js'/>"></script>
<%--    <script type="text/javascript" src="<g:createLinkTo dir='js/plugins/bootstrap'     file='bootstrap.min.js' />"></script>--%>
    <script type="text/javascript" src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/js/bootstrap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.2/modernizr.js"></script>
<%--    <script type="text/javascript" src="<g:createLinkTo dir='js/plugins/jquery'        file='i18next-1.7.7.min.js'/>"></script>--%>
    <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jquery-scrollTo/2.1.0/jquery.scrollTo.min.js"></script>
    <script type="text/javascript" src="<g:createLinkTo dir='js/plugins/another'       file='respond.min.js'/>"></script><%--min/max-width CSS3 Media Queries --%>
    <script type="text/javascript" src="<g:createLinkTo dir='js/layout'                file='lockScreenController.js' />"></script>
    <script type="text/javascript" src="<g:createLinkTo dir='assets/toastr/build'      file='toastr.min.js' />"></script>
    <script type="text/javascript" src="<g:createLinkTo dir='js/plugins/template'      file='ejs_production.js' />"></script>
    <script src="<g:createLinkTo dir='js/plugins/backbone' file='lodash.min.js' />" type="text/javascript"></script>
	<script src="<g:createLinkTo dir='js/plugins/backbone' file='backbone-min.js' />"></script>
    <script src="<g:createLinkTo dir='js/layout/sessionUser' file='sessionUserModel.js' />" type="text/javascript"></script>
    <script type="text/javascript">
        var urlLanguage = '/blueloop/static/js_i18n/messages_' + '<%= session.getAttribute("lang") %>' + '.json';
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
<%--            name:     "${sec.loggedInUserInfo(field: 'firstname')}",--%>
<%--            lastname: "${sec.loggedInUserInfo(field: 'lastname')}",--%>
            role:     "${sec.loggedInUserInfo(field: 'authorities')}",
            imgURI:   "${grails.util.Holders.config.aws.endpoint}${grails.util.Holders.config.aws.bucketBlAppUsers}/${sec.loggedInUserInfo(field: 'username')}/user/avatar.png",
            pubnubChannel: "${grails.util.Holders.config.pubnub.channel_name}"
          });
        </sec:ifLoggedIn>
        
        $().ready(function() {            
	        window.realtime = new Realtime();
	        realtime.init();
        });

        //DELETE after JointJS library will updated
        SVGElement.prototype.getTransformToElement = SVGElement.prototype.getTransformToElement || function(toElement) {
		    return toElement.getScreenCTM().inverse().multiply(this.getScreenCTM());
		};
            
    </script>
    <g:layoutHead/>
    <r:layoutResources />
</head>
<body onmousemove="lockScreen.resetTimers();">
    
    <div class="se-pre-con"></div>
    
    <header class="header dark-bg">
        <g:render template="/layouts/header" />
    </header>
    
    <aside>
        <sec:ifAnyGranted roles="ROLE_USER,ROLE_ADMIN">
            <g:render template="/layouts/sidebar" />
        </sec:ifAnyGranted>
        <sec:ifAnyGranted roles="ROLE_SUPERADMIN">
            <g:render template="/layouts/sidebarAdmin" />
        </sec:ifAnyGranted> 
    </aside>

    <section id="container"  class="sidebar-closed">
        <g:render template="/layouts/pageContent" />
        <div id="time" style="display:none;"></div>
        <%--<g:render template="../layouts/footer" /> --%>
    </section>

    <!-- scripts -->
    <script type="text/javascript" src="<g:createLinkTo dir='js/plugins/another'                file='bootbox.min.js' />"></script>
    <script type="text/javascript" src="<g:createLinkTo dir='js/plugins/bootstrap'              file='moment.min.js' />"></script>
    <script type="text/javascript" src="<g:createLinkTo dir='js/plugins/jquery'                 file='jquery.timeago.min.js' />" ></script>
    <script type="text/javascript" src="<g:createLinkTo dir='js/plugins/jquery/min'             file='jquery.multi-select.min.js' />"></script><%--used by ChatController.js--%>
    <script type="text/javascript" src="<g:createLinkTo dir='js/plugins/jquery/min'      file='jquery.nicescroll.min.js' />"></script>
    <script type="text/javascript" src="https://cdn.pubnub.com/pubnub-3.7.22.min.js"></script>
    <script type="text/javascript" src="<g:createLinkTo dir='js/plugins/jquery/min'             file='jquery.dcjqaccordion.2.7.min.js' />"></script>
    <script type="text/javascript" src="<g:createLinkTo dir='assets/jquery-validation-1.14.0'   file='jquery.validate.min.js' />"></script>
    <script type="text/javascript" src="<g:createLinkTo dir='js/plugins/datatables'             file='datatables.min.js' />"></script>
    <script type="text/javascript" src="<g:createLinkTo dir='js/layout'                         file='RealtimeController.js' />"></script>
    <script type="text/javascript" src="<g:createLinkTo dir='js/layout/chat/chatWindow'         file='chatWidgetModel.js' />"></script>
    <script type="text/javascript" src="<g:createLinkTo dir='js/layout/chat/chatWindow'         file='chatWidgetCollection.js' />"></script>
    <script type="text/javascript" src="<g:createLinkTo dir='js/layout/chat/chatWindow/view'    file='chatWidgetSingleChatView.js' />"></script>
    <script type="text/javascript" src="<g:createLinkTo dir='js/layout/chat/chatWindow/view'    file='chatWidgetGroupChatView.js' />"></script>
    <script type="text/javascript" src="<g:createLinkTo dir='js/layout/chat/chatWindow/view'    file='dropDownChatView.js' />"></script>
    <script type="text/javascript" src="<g:createLinkTo dir='js/layout/chat/chatWindow/view'    file='chatContactListView.js' />"></script>
    <script type="text/javascript" src="<g:createLinkTo dir='js/layout'                         file='ChatController.js' />"></script>
    <script type="text/javascript" src="<g:createLinkTo dir='js/layout'                         file='tabToggle.js' />" ></script>
	
    <%--		Backbone Header--%>	
    <script src="<g:createLinkTo dir='js/layout/header' 	       file='headerBreadrumbModel.js' />"      type="text/javascript"></script>
	<script src="<g:createLinkTo dir='js/layout/header/view'       file='headerBreadcrumbView.js' />"      type="text/javascript"></script>
	<script src="<g:createLinkTo dir='js/layout/header'            file='userNavBarModel.js' />"           type="text/javascript"></script>
	<script src="<g:createLinkTo dir='js/layout/header/view'       file='userNavBarView.js' />"            type="text/javascript"></script>
	<script src="<g:createLinkTo dir='js/layout/header/view'       file='headerView.js' />"                type="text/javascript"></script>

	<%--		Backbone Chat--%>
	<script src="<g:createLinkTo dir='js/layout/newUIChat'         file='singleChatModel.js' />"           type="text/javascript"></script>
	<script src="<g:createLinkTo dir='js/layout/newUIChat' 	       file='singleChatCollection.js' />" 	   type="text/javascript"></script>
	<script src="<g:createLinkTo dir='js/layout/newUIChat' 	       file='groupChatModel.js' />" 	       type="text/javascript"></script>
	<script src="<g:createLinkTo dir='js/layout/newUIChat'         file='groupChatCollection.js' />" 	   type="text/javascript"></script>
	<script src="<g:createLinkTo dir='js/layout/newUIChat/view'    file='singleChatView.js' />" 	       type="text/javascript"></script>
	<script src="<g:createLinkTo dir='js/layout/newUIChat/view'    file='groupChatView.js' />" 	           type="text/javascript"></script>
	<script src="<g:createLinkTo dir='js/layout/newUIChat/view'    file='chatCategoryView.js' />" 	       type="text/javascript"></script>
	<script src="<g:createLinkTo dir='js/layout/newUIChat/view'    file='chatPanelView.js' />" 	           type="text/javascript"></script>
	
	<script src="<g:createLinkTo dir='js/layout/notificationsPanel'        file='notificationModel.js' />"         type="text/javascript"></script>
	<script src="<g:createLinkTo dir='js/layout/notificationsPanel'        file='notificationCollection.js' />"    type="text/javascript"></script>
	<script src="<g:createLinkTo dir='js/layout/notificationsPanel/view'   file='notificationView.js' />"          type="text/javascript"></script>
	<script src="<g:createLinkTo dir='js/layout/notificationsPanel/view'   file='notificationsPanelView.js' />"    type="text/javascript"></script>
	
	
    <script type="text/javascript" src="<g:createLinkTo dir='js/layout' file='commonScripts.js' />" ></script>
    <r:layoutResources />
</body>
</html>