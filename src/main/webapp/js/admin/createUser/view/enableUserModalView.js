var enableUserModalView = Backbone.View.extend({
    
    template: '/blueloop/static/js/admin/createUser/template/enableUserModalTemplate.ejs',
    
    constructor : function (options) {
        _.extend(this, options);
    },

    render: function() {
    	this.userdata = ajaxCall('GET','/blueloop/administrator/getUserByEmailAndCompany/', {email:this.email}, "text/json", "json", false);
   		this.$el = $(new EJS({url: this.template }).render({user:this.userdata.user, image:this.userdata.image}));  
    	this.setEvents();
        return this;
    },   
	
    setEvents: function(){
        this.$el.find("#enableUser").click(this,this.enableUser);
    },

    enableUser: function(e){
    	var user = {userId:e.data.userdata.user.id};
		var dataReturned = $.ajax({
			type: 'POST',
			url: '/blueloop/user/changeEnabledUser/',
			data: JSON.stringify(user),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			async: false,
			success: function(data, textStatus) {
				toastr.success(json.user.enabled);
				$("#enable-user-modal").remove();
				$("#new-user-modal").remove();
			},
			error: function(httpRequest, textStatus, errorThrown) { 
				toastr.error(httpRequest.responseJSON.error);
		 	}
		});
    },
});