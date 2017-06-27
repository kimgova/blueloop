var teammemberEmailModalView = Backbone.View.extend({

	template: '/blueloop-backend/static/js/teamwork/main/template/teammemberEmailModal.ejs',
	
	constructor : function (options) {
		_.extend(this, options);
	},

	render: function() {
		this.$el = $(new EJS({url: this.template }).render({name:this.name})); 
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
				var obj = {idUser:e.data.id,subject:e.data.$el.find("#subjectTM").val(),message:e.data.$el.find("#messageTM").val()};
				var response = ajaxCall('GET', '/blueloop-backend/teamwork/sendEmailTeammember/', obj, "text/json", "json", false);
				
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