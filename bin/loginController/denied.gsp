<head>
<meta name='layout' content='main' />
<title><g:message code="auth.denied.title" /></title>
<link rel="stylesheet" href="${resource(dir: 'css/custom', file: 'denied.css')}" type="text/css">
</head>

<body>
<div class='body'>
	<div class='col-md-12 page-404'>
	   <div class='number font-red'><img height="200" width="200" src="/blueloop-backend/static/images/denied.svg"></div>
	   <div class='details'>
	       <h3>Access Denied</h3>
	       <p><g:message code="auth.denied.message" /></p>
	       <a href="/blueloop-backend"> Return Home </a>
	   </div>
	</div>
</div>
</body>
