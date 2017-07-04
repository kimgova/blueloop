import blueloop.UserPasswordEncoderListener
// Place your Spring DSL code here
beans = {
    userPasswordEncoderListener(UserPasswordEncoderListener, ref('hibernateDatastore'))
	
	userDetailsService(utils.MyUserDetailsService)
}
