package blueloop

import grails.converters.JSON
import grails.plugin.springsecurity.annotation.Secured

@Secured('permitAll')
class LoginController {

    def index() { }
}
