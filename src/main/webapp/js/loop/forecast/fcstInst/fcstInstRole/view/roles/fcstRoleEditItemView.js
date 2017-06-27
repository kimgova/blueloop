var forecastRoleEditItemView = Backbone.View.extend({
    
    template: '/blueloop-backend/static/js/loop/forecast/fcstInst/fcstInstRole/template/roles/editItemRoleTemplate.ejs',
        
    render: function () {
        this.$el = $(new EJS({url: this.template }).render(this.model.toJSON()));
        this.$el.find(".saveRole").click(this,this.saveEditRole);
        this.$el.find(".cancelRole").click(this,this.cancelEditRole);
        return this;
    },
    
    saveEditRole: function(e){
    	var newname = e.data.$el.find("#nameRole").val(); 
    	if(e.data.validate(newname)){    	   	
	    	var datarole = JSON.parse(e.data.editRole(e.data.model, newname));
	    	e.data.model.set("name", newname);
	    	var itemView = new forecastRoleItemView( { model: e.data.model } );
	    	e.data.$el.parent().after(itemView.render().$el);
	    	e.data.remove();
    	}
    },
    
    editRole: function(model,newname){
    	var role = {id:model.id,name:newname};
    	var dataReturned = $.ajax({
	        type: 'POST',
	        url: '/blueloop-backend/fcstRole/editForecastRole/',
	        data: JSON.stringify(role),
	        contentType: 'application/json; charset=utf-8',
	        dataType: 'json',
	        async: false,
	        success: function(data, textStatus) {
	        	data =  data;
	        	toastr.success(json.forecast.fcstInstRoleEdited);
	        },
	    	error: function(httpRequest, textStatus, errorThrown) { 
	     	   console.log("status=" + textStatus + " ,error=" + errorThrown);
	     	   toastr.error(json.error.tryAgain);
	     	}
	    });
    	return dataReturned.responseText;
    },
    
    validate: function(roleName){
		var valid = true;
		if(roleName.trim() == "" || /^\s*$/.test(roleName)){
			toastr.error(json.error.errorEmptyRole);
			valid = false;
		}
		return valid;
	},
    
    cancelEditRole: function(e) {
    	var itemView = new forecastRoleItemView( { model: e.data.model } );
    	e.data.$el.parent().after(itemView.render().$el);
    	e.data.remove();
    }

});