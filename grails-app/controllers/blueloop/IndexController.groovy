package blueloop

import grails.converters.JSON
import grails.plugin.springsecurity.annotation.Secured
import javax.servlet.http.HttpServletRequest;
//import org.codehaus.groovy.grails.web.json.JSONObject
import org.springframework.dao.DataIntegrityViolationException
//import cr.sa.bl.ChatService
//import org.apache.commons.io.FileUtils;
import java.io.File;
import org.springframework.web.servlet.support.RequestContextUtils as RCU
//import cr.sa.bl.utils.LanguageMapper

import java.io.File;
import java.io.IOException;
import java.sql.SQLException;
import java.util.Collection;
import java.util.logging.Level;
import java.util.logging.Logger;


@Secured(['ROLE_SUPERADMIN','ROLE_ADMIN', 'ROLE_USER'])
class IndexController {

	def springSecurityService
//	def chatService
//	def userService
//	def alertService
//  def synchronizerTokenService
//	def grailsApplication
	
	static allowedMethods = [index: "GET", indexAdmin: "GET"]
	
	def index (Integer max) {
		def user = springSecurityService.getCurrentUser()
		def screenName

//		userService.createDirectories(user)
		
		// Set application language using user language preference
		if(user.language!=null){
//			def localeString= LanguageMapper.getLocale(user.language.name);
//			RCU.getLocaleResolver(request).setLocale(request, response, new Locale(localeString.toLowerCase(), localeString))
//			session.setAttribute("lang", localeString.toLowerCase())
			session.setAttribute("lang", "en")
		}
		else{
			session.setAttribute("lang", "en")
		}
		
////		TwitterUser twitterUserInstance = user.twitterUser
//		if(twitterUserInstance){
//			 screenName = twitterUserInstance.username
//		}

		[user:user, screen_name:screenName/*,csrf:synchronizerTokenService.getNewToken(request.forwardURI,session)*/ ]
	}
	
}