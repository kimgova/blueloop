<!DOCTYPE html>
<html lang="en">
    <head> 
        
        <meta name="layout"     content="main"/>
        <meta name="pageActive" content="home" />
        <meta name="navActive"  content="home" />
        <title><g:message code="general.home"/></title>

    </head>
  <body active="home"> 
    <sec:ifAnyGranted roles="ROLE_USER,ROLE_ADMIN">
	    <div class="row row-home">
	        <div class="col-lg-12" style="margin-bottom:2%">
	            <div class="welcome">
	                <h1>Welcome to blue-loop!</h1>
	            </div>
	        </div>
	    </div>      
	    <div class="row">
	            <g:render template="links"/>
	    </div>
    </sec:ifAnyGranted>
    <sec:ifAnyGranted roles="ROLE_SUPERADMIN">
        <div class="row row-home">
	        <div class="col-lg-12" style="margin-bottom:2%">
	            <div class="welcome">
	                <h1>Admin Console</h1>
	            </div>
	        </div>
	    </div>      
	    <div class="row">
	            <g:render template="adminLinks"/>
	    </div>
    </sec:ifAnyGranted>  
    
</body>
</html>
