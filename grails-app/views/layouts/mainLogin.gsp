<!DOCTYPE html>
<!--[if lt IE 7 ]> <html lang="en" class="no-js ie6"> <![endif]-->
<!--[if IE 7 ]>    <html lang="en" class="no-js ie7"> <![endif]-->
<!--[if IE 8 ]>    <html lang="en" class="no-js ie8"> <![endif]-->
<!--[if IE 9 ]>    <html lang="en" class="no-js ie9"> <![endif]-->
<!--[if (gt IE 9)|!(IE)]><!-->
<html lang="en" class="no-js">
<!--<![endif]-->
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
		<title><g:layoutTitle default="Grails" /></title>
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<link rel="shortcut icon" href="${resource(dir: 'images', file: 'favicon.ico')}" type="image/x-icon">
		<link rel="stylesheet" href="${resource(dir: 'css/plugins/bootstrap', file: 'bootstrap.min.css')}" type="text/css">
		<link rel="stylesheet" href="${resource(dir: 'css/custom', file: 'main.css')}" type="text/css">
		<link rel="stylesheet" href="${resource(dir: 'assets/font-awesome/css', file: 'font-awesome.min.css')}" type="text/css" media='screen'>
		<link rel="stylesheet" href="${resource(dir: 'assets/iCheck-master/square/', file: 'blue.css')}" type="text/css">
		
		<g:layoutHead />
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
									<g:layoutBody />
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
  		<script type="text/javascript" src="<g:createLinkTo dir='assets/jquery-validation-1.14.0'   file='jquery.validate.min.js' />"></script>
  		<script src="<g:createLinkTo dir='js/plugins/bootstrap' file='bootstrap.min.js' />"></script>
		<script src="<g:createLinkTo dir='js/login' file='auth.js' />"></script>
		<script src="<g:createLinkTo dir='assets/iCheck-master/' file='icheck.min.js' />"></script>
	</body>
</html>
