package blueloop

import grails.converters.JSON
import grails.plugin.springsecurity.annotation.Secured


import grails.converters.JSON

import javax.servlet.http.HttpServletResponse

import org.springframework.security.authentication.AccountExpiredException
import org.springframework.security.authentication.CredentialsExpiredException
import org.springframework.security.authentication.DisabledException
import org.springframework.security.authentication.LockedException
import org.springframework.security.core.context.SecurityContextHolder as SCH
import org.springframework.security.web.WebAttributes

import grails.plugin.springsecurity.SpringSecurityUtils
import org.springframework.web.servlet.support.RequestContextUtils as RCU


@Secured('permitAll')
class LoginController {

	/**
	 * Dependency injection for the authenticationTrustResolver.
	 */
	def authenticationTrustResolver

	/**
	 * Dependency injection for the springSecurityService.
	 */
	def springSecurityService
	def userService
//	def emailService

	/**
	 * Default action; redirects to 'defaultTargetUrl' if logged in, /login/auth otherwise.
	 */
	def index() {
		if (springSecurityService.isLoggedIn()) {
			redirect uri: SpringSecurityUtils.securityConfig.successHandler.defaultTargetUrl
		}
		else {
			redirect action: 'auth', params: params
		}
	}

	/**
	 * Show the login page.
	 */
	def auth() {
		def config = SpringSecurityUtils.securityConfig

		if (springSecurityService.isLoggedIn()) {
			redirect uri: config.successHandler.defaultTargetUrl
			return
		}

		String view = 'auth'
		String postUrl = "${request.contextPath}${config.apf.filterProcessesUrl}"
		render view: view, model: [postUrl: postUrl,
								   rememberMeParameter: config.rememberMe.parameter]
	}

	/**
	 * The redirect action for Ajax requests.
	 */
	def authAjax() {
		response.setHeader 'Location', SpringSecurityUtils.securityConfig.auth.ajaxLoginFormUrl
		response.sendError HttpServletResponse.SC_UNAUTHORIZED
	}

	/**
	 * Show denied page.
	 */
	def denied() {
		if (springSecurityService.isLoggedIn() &&
				authenticationTrustResolver.isRememberMe(SCH.context?.authentication)) {
			// have cookie but the page is guarded with IS_AUTHENTICATED_FULLY
			redirect action: 'full', params: params
		}
	}

	/**
	 * Login page for users with a remember-me cookie but accessing a IS_AUTHENTICATED_FULLY page.
	 */
	def full() {
		def config = SpringSecurityUtils.securityConfig
		render view: 'auth', params: params,
			model: [hasCookie: authenticationTrustResolver.isRememberMe(SCH.context?.authentication),
					postUrl: "${request.contextPath}${config.apf.filterProcessesUrl}"]
	}

	/**
	 * Callback after a failed login. Redirects to the auth page with a warning message.
	 */
	def authfail() {

		String msg = ''
		def exception = session[WebAttributes.AUTHENTICATION_EXCEPTION]
		if (exception) {
			if (exception instanceof AccountExpiredException) {
				msg = g.message(code: "springSecurity.errors.login.expired")
			}
			else if (exception instanceof CredentialsExpiredException) {
				msg = g.message(code: "springSecurity.errors.login.passwordExpired")
			}
			else if (exception instanceof DisabledException) {
				msg = g.message(code: "springSecurity.errors.login.disabled")
			}
			else if (exception instanceof LockedException) {
				msg = g.message(code: "springSecurity.errors.login.locked")
			}
			else {
				msg = g.message(code: "springSecurity.errors.login.fail")
			}
		}
		
		if (springSecurityService.isAjax(request)) {
			render([error: msg] as JSON)
		}else{
			flash.message = msg
			flash.error = "error"
			redirect action: 'auth', params: params
		}
	}

	/**
	 * The Ajax success redirect url.
	 */
	def ajaxSuccess() {
		render([success: true, username: springSecurityService.authentication.name] as JSON)
	}

	/**
	 * The Ajax denied redirect url.
	 */
	def ajaxDenied() {
		render([error: 'access denied'] as JSON)
	}

	@Secured(['ROLE_ADMIN', 'ROLE_USER', "ROLE_SUPERADMIN"])
	def lockscreen() {
		[userInstance: springSecurityService.currentUser]
	}
	
	def resetPassword = {
//		def jsonObj = request.JSON
//		def user    = User.findByEmail(jsonObj.email)
//		if(!user){
//			render([error: 'User not found'] as JSON)
//			throw new RuntimeException("User not found")
//		}
//
//		def newPassword = userService.generateRandomPassword()
//		user.password   = newPassword
//		user.passwordDate    = new Date();
//
//		if(!user.save(flush: true, failOnError:true)){
//			log.error "Error generating new password ${user.errors}"
//			render([error: 'Error generating new password'] as JSON)
//			throw new RuntimeException("Error generating new password")
//		}
//
//		sendMail {
//			to user.email
//			from "blue-loop"
//			subject "blue-loop.com password reset"
//			body(view:"/email/forgotPass_mailTemplate",
//			model:[newPass:newPassword, user: user])
//		}
//
//		render([success: true] as JSON)
	}
	
	def concurrentSession = {
			render view: "concurrentSession"
	}
}
