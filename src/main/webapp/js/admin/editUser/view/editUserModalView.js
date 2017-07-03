var editUserModalView = Backbone.View.extend({
    
    template: '/blueloop/static/js/admin/editUser/template/editUserModalTemplate.ejs',
    
    constructor : function (options) {
        _.extend(this, options);
    },

    render: function() {
    	this.userdata = ajaxCall('GET','/blueloop/administrator/getUserByEmailAndCompany/', {email:this.email}, "text/json", "json", false);
   		this.$el = $(new EJS({url: this.template }).render({user:this.userdata.user}));  
    	this.setEvents();
    	this.loadTimeZone();
        return this;
    },   
	
    setEvents: function(){
        this.$el.find("#saveEditUser").click(this,this.saveUser);
    },
       
    saveUser: function(e){
    	$("#formEditUser").validate({
			debug: true,
		 	rules: { firstName : 'required', 
		 			 lastName: 'required', 
		 			 email: 'required', 
		 			 department: 'required', 
		 			 username: {
		 		       required: true,
		 		       minlength: 3
		 		     }
		 		   },
			success: "valid",
			submitHandler: function(form) {
				e.data.save();
			}
		});
    },
    
    save: function(){
    	var that = this;
    	var user = {userId:this.userId,firstName:this.$el.find("#firstName").val(),lastName:this.$el.find("#lastName").val(),email:this.$el.find("#email").val(),
    	            department:this.$el.find("#department").val(),username:this.$el.find("#username").val(),timezone:this.$el.find("#userTimeZone option:selected").val()};
		var dataReturned = $.ajax({
			type: 'POST',
			url: '/blueloop/user/editUser/',
			data: JSON.stringify(user),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			async: false,
			beforeSend : function() {
                $("body").addClass("loading");
            },
			success: function(data, textStatus) {
				toastr.success(json.user.saved);

				that.tablerow.model.set("name", data.user.firstName + " " + data.user.lastName)
				that.tablerow.model.set("email", data.user.email)
				that.tablerow.model.set("image", data.image)
		        var rowView = new userAccountRowView( { model: that.tablerow.model, tableView:that.tablerow.tableView} );
		        
				that.tablerow.tableView.datatable.rows(that.tablerow.$el).remove();
				that.tablerow.remove();
		        
		        rowView.tableView.datatable.rows.add(rowView.render().$el).draw();
				that.$el.remove();	
				$("body").removeClass("loading");
			},
			error: function(httpRequest, textStatus, errorThrown) {
				 $("body").removeClass("loading");
				toastr.error(httpRequest.responseJSON.error);
		 	}
		});
    },
    
    loadTimeZone: function(){
        var that = this;
        jQuery.ajax({
            type : 'POST',
            data : {timezone:this.userdata.user.timeZone},
            url : '/blueloop/administrator/getSelectTimezone',
            success : function(data, textStatus) {
                that.$el.find(".timezone").html(data);
            },
            error : function(XMLHttpRequest, textStatus, errorThrown) {
                console.info("Error getting select of timezone");
            }
        });
    }
});