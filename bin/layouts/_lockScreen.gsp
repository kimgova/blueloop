<div aria-hidden="true" aria-labelledby="myModalLabel" role="dialog"
	tabindex="-1" id="lockScreenDiv" class="lock-screen"
	data-keyboard="false" data-backdrop="static">
	<div class="lock-wrapper">
		<div id="time"></div>
		<div class="lock-box text-center">
			<img id="lockAvatarImg"
				src="${grails.util.Holders.config.aws.endpoint}${grails.util.Holders.config.aws.bucketBlAppUsers}/${sec.loggedInUserInfo(field: 'username')}/user/avatar.png" alt="lock avatar" />
			<h1>
				<sec:ifLoggedIn>
					${sec.loggedInUserInfo(field: 'firstname')}
					${sec.loggedInUserInfo(field: 'lastname')}
				</sec:ifLoggedIn>
			</h1>
			<span class="locked"><g:message code="auth.locked"/></span>
			<form action='${request.contextPath}/j_spring_security_check' method='POST' id='ajaxLoginForm' name='ajaxLoginForm' class='form-inline' role="form">
				<div class="form-group col-lg-12">
					<input type='text' class='text_' name='j_username' id='username' value="${sec.loggedInUserInfo(field: 'username')}" style="display: none;" /> 
					<input type="password" placeholder="Password" name='j_password' id='lockedPassword' class="form-control lock-input"> 
					<span class="btn btn-lock" id="authAjax"> 
						<i class="fa fa-arrow-right"></i>
					</span>
				</div>
			</form>
			<div style='display: none; text-align: left; color:red;' id='loginMessage'></div>
		</div>
		
		<div class="text-center" style="margin-top: 45px;">
		  <a id="loginAnotherUser" href="/blueloop/logout"><g:message code="auth.anotherUser"/></a>
		</div>
		
	</div>
</div>
