var teamworkEmailModalView = Backbone.View.extend({

	template: '/blueloop-backend/static/js/teamwork/main/template/teamworkEmailModal.ejs',

	render: function() {
		this.$el = $(new EJS({url: this.template }).render(this.model.toJSON())); 
		this.setEvents();
        return this;
	},
	
	setEvents: function(){
		this.$el.find("#sendBtn").click(this,this.sendMail);
	},
	
	sendMail: function(e){
		e.data.$el.find("form").validate({
			success: "valid",
			submitHandler: function(form,data) {
				var obj = {idteam:e.data.model.id,subject:e.data.$el.find("#subject").val(),message:e.data.$el.find("#message").val()};
				var response = ajaxCall('GET', '/blueloop-backend/teamwork/sendEmailTeam/', obj, "text/json", "json", false);
				
				if(response.result == "true"){
					toastr.success(json.teamwork.emailSent);
				}else{
					toastr.error(json.teamwork.emailNotSent);
				}
				e.data.$el.modal("hide");
			}
		});
	}
	
});