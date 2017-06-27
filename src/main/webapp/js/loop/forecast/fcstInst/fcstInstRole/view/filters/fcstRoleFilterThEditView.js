var forecastRoleFilterThEditView = Backbone.View.extend({
    
    template: '/blueloop-backend/static/js/loop/forecast/fcstInst/fcstInstRole/template/filters/editThTableRoleFilterTemplate.ejs',
        
    render: function () {
        this.$el = $(new EJS({url: this.template }).render(this.model.toJSON()));
        this.$el.find(".saveEditFilter").click(this,this.saveEditFilter);
        this.$el.find(".cancelEditFilter").click(this,this.cancelEditFilter);
        return this;
    },
    
    saveEditFilter: function(e){
    	var newname = e.data.$el.find("#nameFilter").val();  
    	if(e.data.validate(newname)){
	    	var dataFilter = JSON.parse(e.data.editFilter(e.data.model, newname));
	    	e.data.model.set("name", newname);
	    	var thView = new forecastRoleFilterThView( { model: e.data.model } );
	    	thView.instanceId = e.data.instanceId;
	    	thView.roleId =  e.data.roleId;   		
	    	e.data.$el.parent().after(thView.render().$el);
	    	e.data.$el.parent().remove()
	    	e.data.remove();
    	}
    },
    
    editFilter: function(model,newname){
    	var role = {id:model.id,name:newname};
    	var dataReturned = $.ajax({
	        type: 'POST',
	        url: '/blueloop-backend/fcstRoleFilter/editForecastRoleFilter/',
	        data: JSON.stringify(role),
	        contentType: 'application/json; charset=utf-8',
	        dataType: 'json',
	        async: false,
	        success: function(data, textStatus) {
	        	data =  data;
	        	toastr.success(json.forecast.fcstInstFilterRoleEdited);
	        },
	    	error: function(httpRequest, textStatus, errorThrown) { 
	     	   console.log("status=" + textStatus + " ,error=" + errorThrown);
	     	   toastr.error(json.error.tryAgain);
	     	}
	    });
    	return dataReturned.responseText;
    },
    
    validate: function(filterName){
		var valid = true;
		if(filterName.trim() == "" || /^\s*$/.test(filterName)){
			toastr.error(json.error.errorEmptyFilterName);
			valid = false;
		}
		return valid;
	},
    
    cancelEditFilter: function(e) {
    	var thView = new forecastRoleFilterThView( { model: e.data.model } );
    	thView.instanceId = e.data.instanceId;
    	thView.roleId =  e.data.roleId; 
    	e.data.$el.parent().after(thView.render().$el);
    	e.data.$el.parent().remove()
    }

});