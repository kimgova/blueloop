var createUserModalView = Backbone.View.extend({
    
    template: '/blueloop/static/js/admin/createUser/template/createUserModalTemplate.ejs',
    
    constructor : function (options) {
        _.extend(this, options);
    },

    render: function() {
   		this.$el = $(new EJS({url: this.template }).render({}));  
   		this.setEvents();
    	this.loadTimeZone();
        return this;
    },   
	
    setEvents: function(){
        this.$el.find("#saveNewUser").click(this,this.saveUser);
    },
       
    saveUser: function(e){
    	$("#formNewUser").validate({
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
    	var user = {firstName:this.$el.find("#firstName").val(),lastName:this.$el.find("#lastName").val(),email:this.$el.find("#email").val(),
    	            department:this.$el.find("#department").val(),username:this.$el.find("#username").val(),timezone:this.$el.find("#userTimeZone option:selected").val()};
    	this.email = this.$el.find("#email").val(); 
		var dataReturned = $.ajax({
			type: 'POST',
			url: '/blueloop/user/saveUser/',
			data: JSON.stringify(user),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			async: false,
			success: function(data, textStatus) {
				if(data.user != "disabled"){	
					toastr.success(json.user.saved);
					var model = new userModel({
		                id:       data.user.id,
		                name:     data.user.firstName + " " + data.user.lastName,
		                email:    data.user.email,
		                lastLogin:"- - -",
		                image:    data.image,
		                permissions: []
		            });
			        var rowView = new userAccountRowView( { model: model, tableView:that.tableView} );
			        that.tableView.datatable.rows.add(rowView.render().$el).draw();
			        that.tableView.collection.add(model);
			        
			        that.$el.modal("hide");
			        that.$el.remove();
			        $('body').removeClass('modal-open');
			        $('.modal-backdrop').remove();
				}else{
					$("#enable-user-modal").remove();	
			    	var modalView = new enableUserModalView({email:that.email});
			    	modalView.render().$el.modal("show");
				}
			},
			error: function(httpRequest, textStatus, errorThrown) { 
				toastr.error(httpRequest.responseJSON.error);
		 	}
		});
    },
    
    loadTimeZone: function(){
        var that = this;
        jQuery.ajax({
            type : 'POST',
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