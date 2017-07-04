package blueloop

import javax.servlet.http.HttpServletResponse
import org.springframework.security.access.annotation.Secured
import grails.plugin.springsecurity.SpringSecurityUtils
import org.json.*


@Secured('permitAll')
class LogoutController {
//	def chatService 
	def springSecurityService
//	def pubnubService

	def index() {

		if (!request.post && SpringSecurityUtils.getSecurityConfig().logout.postOnly) {
			response.sendError HttpServletResponse.SC_METHOD_NOT_ALLOWED // 405
			return
		}

//		if(springSecurityService.currentUser != null){
//			pubnubService.unsubscribe()
//		}
		
		redirect uri: SpringSecurityUtils.securityConfig.logout.filterProcessesUrl // '/j_spring_security_logout'
	}
}
