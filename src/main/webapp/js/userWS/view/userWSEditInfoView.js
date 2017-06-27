var userWSEditInfoView = Backbone.View.extend({
    
    template: '/blueloop-backend/static/js/userWS/template/userWSEditInfoTemplate.ejs',
    
    constructor : function (options) {
        _.extend(this, options);
    },
  
    render: function() {
    	this.getCountries();
    	this.$el = $(new EJS({url: this.template }).render({user:this.model.toJSON(),countries:this.countries}));
    	this.setEvents();
        return this;
    },
    
    getCountries: function(){
    	var data = ajaxCall('GET','/blueloop-backend/city/getCountries/', {}, "text/json", "json", false);
    	this.countries = data.countries;
    },
    
    setEvents: function(){
    	this.$el.find("#btnSaveInfo").click(this,this.saveUserInfo);
    	
    },
    
    saveUserInfo: function(e){
    	var userData = $(e.data.$el).find("form").serializeObject();
    	userData.id = e.data.model.id;
    	var data = ajaxCall('GET','/blueloop-backend/user/updateInfo/', userData, "text/json", "json", false);
    	e.data.containerView.updateUserInfo();
    	toastr.success(json.profile.personalInfoSaved);
    }
	
});