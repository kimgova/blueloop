package blueloop
import grails.plugin.springsecurity.annotation.Secured

class InicioController {
 
    @Secured('ROLE_ADMIN')
    def index() {
        render 'you have ROLE_ADMIN'
    }
    
    
   @Secured(['ROLE_USER'])
   def adminEither() {
      render 'you have ROLE_USER'
   }
   
    
   @Secured(value = ['ROLE_ADMIN'], httpMethod = 'POST')
   def save() {
      
   }
}
