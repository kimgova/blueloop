var forecastRoleItemView = Backbone.View.extend({
    
    template: '/blueloop/static/js/loop/forecast/fcstInst/fcstInstRole/template/roles/itemRoleTemplate.ejs',
        
    render: function () {
        this.$el = $(new EJS({url: this.template }).render(this.model.attributes));
        this.setEvents();
        return this;
    },
    
    setEvents: function(){
    	this.$el.find(".content").click(this,this.getUsers);
    	this.$el.find(".removeRole").click(this,this.removeRole);
    	this.$el.find(".editRole").click(this,this.editRole);
    },
    
    getUsers: function(e) {
    	var tabView = new forecastRoleTabView();
    	tabView.instanceId = e.data.instanceId;
    	tabView.roleId =  e.data.model.get('id');
    	$('#detailRole').html(tabView.render().$el);
		$('#detailRole').find('#titleRole').html('Selected Role: ' + e.data.model.get('name'));
		
    	e.data.$el.parent().find('li').removeClass('selected');
    	e.data.$el.parent().find('li').addClass('list-primary');
    	e.data.$el.parent().find('li').removeClass('list-danger');
    	
 		e.data.$el.addClass('selected');    	
 		e.data.$el.removeClass('list-primary');    
 		e.data.$el.addClass('list-danger');    	
    },

    removeRole: function(e){
    	bootbox.confirm(json.general.deleteRow, function (r) {
			if(r){
		    	var userForecastRole = {id:e.data.model.id};
		    	var dataReturned = $.ajax({
			        type: 'POST',
			        url: '/blueloop/fcstRole/deleteForecastRole/',
			        data: JSON.stringify(userForecastRole),
			        contentType: 'application/json; charset=utf-8',
			        dataType: 'json',
			        async: false,
			        success: function(data, textStatus) {
			        	data =  data;
			        	e.data.remove();
			        	toastr.success(json.forecast.fcstInstRoleDeleted);
			        },
			    	error: function(httpRequest, textStatus, errorThrown) { 
			     	   console.log("status=" + textStatus + " ,error=" + errorThrown);
			     	   toastr.error("This role can not be deleted, it has associated data");
			     	}
			    });
		    }
		});
    },
    
    editRole: function(e){
    	var editView = new forecastRoleEditItemView( { model: e.data.model } );
		e.data.$el.html(editView.render().$el);    	
    },
    
});