var forecastRoleNewItemView = Backbone.View.extend({
    
    template: '/blueloop/static/js/loop/forecast/fcstInst/fcstInstRole/template/roles/newItemRoleTemplate.ejs',
        
    constructor : function (options) {
		_.extend(this, options);
	},
    
    render: function () {
    	this.$el = $(new EJS({url: this.template }).render());
        this.$el.find(".saveRole").click(this,this.saveNewRole);
        this.$el.find(".cancelRole").click(this,this.cancelNewRole);               
    	
        return this;
    },
 
    saveNewRole: function(e){
    	var roleName = e.data.$el.find('#nameRole').val()
    	if(e.data.validate(roleName)){
    		var newrole = JSON.parse(e.data.saveRole(roleName, e.data.instanceId));
        	var model = new forecastRoleModel({
        		id:		   		  newrole.id,
          	    name:			  newrole.name,
          	    forecastChain: 	  newrole.fcstChain.id    	
          	});
        	var itemView = new forecastRoleItemView( { model: model } );
            itemView.instanceId = e.data.instanceId;
     		$('#roleList').append(itemView.render().$el);
        	e.data.remove();
    	}		
    },
    
    saveRole: function(roleName, instanceId){
    	var dataRole = {roleName:roleName,instanceId:instanceId}; 
    	var dataReturned = $.ajax({
	        type: 'POST',
	        url: '/blueloop/fcstRole/saveForecastRole/',
	        data: JSON.stringify(dataRole),
	        contentType: 'application/json; charset=utf-8',
	        dataType: 'json',
	        async: false,
	        success: function(data, textStatus) {
	        	data =  data;
	        	toastr.success(json.forecast.fcstInstRoleAdded);
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
	
    cancelNewRole: function(e) {
    	e.data.remove();
    }

});