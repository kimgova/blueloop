package blueloop

import groovy.transform.EqualsAndHashCode
import groovy.transform.ToString
import grails.compiler.GrailsCompileStatic

@GrailsCompileStatic
@EqualsAndHashCode(includes='username')
@ToString(includes='username', includeNames=true, includePackage=false)
class User implements Serializable {

	private static final long serialVersionUID = 1

	String username
	String password
	boolean enabled = true
	boolean accountExpired
	boolean accountLocked
	boolean passwordExpired
	String firstName
	String lastName
	String email
	Language language
	
	Set<Role> getAuthorities() {
		(UserRole.findAllByUser(this) as List<UserRole>)*.role as Set<Role>
	}

	static constraints = {
		password blank: false, password: true
		username blank: false, unique: true
		firstName nullable: true
		lastName nullable: true
		email unique: true
		language nullable: true
	}

	static mapping = {
		password column: '`password`'
	}
	
	String toString() {
		def name = firstName + " " + lastName
		return name
	}
}
