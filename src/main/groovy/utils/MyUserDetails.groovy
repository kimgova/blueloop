package utils

import grails.plugin.springsecurity.userdetails.GrailsUser
import org.springframework.security.core.GrantedAuthority 
import org.springframework.security.core.userdetails.User

class MyUserDetails extends GrailsUser {

	final String firstname
	final String lastname

	MyUserDetails(String username, String password, boolean enabled, 
				  boolean accountNonExpired, boolean credentialsNonExpired, 
				  boolean accountNonLocked, 
				  Collection<GrantedAuthority> authorities, 
				  long id, String firstname, String lastname) {
		super(username, password, enabled, accountNonExpired, 
			  credentialsNonExpired, accountNonLocked, authorities, id)

		this.firstname = firstname
		this.lastname = lastname
	}
}
