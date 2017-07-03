var forecastRoleFilterThView = Backbone.View.extend({
    
    template: '/blueloop/static/js/loop/forecast/fcstInst/fcstInstRole/template/filters/thTableRoleFiltersTemplate.ejs',
        
    render: function () {
        this.$el = $(new EJS({url: this.template }).render(this.model.attributes));
        this.setEvents();
        return this;
    },
    
    setEvents: function(){
    	this.$el.find(".removeFilter").click(this,this.removeFilter);
    	this.$el.find(".editFilter").click(this,this.editFilter);
    },

    removeFilter: function(e){
    	bootbox.confirm(json.general.deleteRow, function (r) {
			if(r){
		    	var forecastRoleFilter = {id:e.data.model.id};
		    	var dataReturned = $.ajax({
			        type: 'POST',
			        url: '/blueloop/fcstRoleFilter/deleteForecastRoleFilter/',
			        data: JSON.stringify(forecastRoleFilter),
			        contentType: 'application/json; charset=utf-8',
			        dataType: 'json',
			        async: false,
			        success: function(data, textStatus) {
			        	data =  data;
			        	toastr.success(json.forecast.fcstInstFilterRoleDeleted);
			        	
			        	var tableView = new forecastRoleFilterTableView();
			        	tableView.instanceId = e.data.instanceId;
			        	tableView.roleId =  e.data.roleId;
			        	$("#roleFilters").html(tableView.render().$el);
			        	
			        	tableView.setICheck();
			        	tableView.setPagination();
			        	
			        	e.data.remove();
			        },
			    	error: function(httpRequest, textStatus, errorThrown) { 
			     	   console.log("status=" + textStatus + " ,error=" + errorThrown);
			     	   toastr.error("This filter can not be deleted, it has associated data");
			     	}
			    });
		    }
		});
    },
    
    editFilter: function(e){
    	var editView = new forecastRoleFilterThEditView( { model: e.data.model } );
    	editView.instanceId = e.data.instanceId;
    	editView.roleId =  e.data.roleId;
		e.data.$el.html(editView.render().$el);    	
    },
    
});