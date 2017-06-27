var userForecastRoleRowView = Backbone.View.extend({
    
    template: '/blueloop-backend/static/js/loop/forecast/fcstInst/fcstInstRole/template/userlist/rowUserRoleTemplate.ejs',
        
    render: function () {
        this.$el = $(new EJS({url: this.template }).render(this.model.attributes));
        this.$el.find("#deleteUser").click(this,this.deleteRow);
        return this;
    },
	
	deleteRow: function(e){
		bootbox.confirm(json.general.deleteRow, function (r) {
			if(r){
		    	var userForecastRole = {id:e.data.model.id};
		    	var dataReturned = $.ajax({
			        type: 'POST',
			        url: '/blueloop-backend/fcstRole/deleteUserForecastRole/',
			        data: JSON.stringify(userForecastRole),
			        contentType: 'application/json; charset=utf-8',
			        dataType: 'json',
			        async: false,
			        success: function(data, textStatus) {
			        	data =  data;
			        	e.data.table.collection.remove(e.data.model);			        	
			        	e.data.remove();
			        	toastr.success(json.forecast.fcstInstRoleUserDeleted);
			        },
			    	error: function(httpRequest, textStatus, errorThrown) { 
			     	   console.log("status=" + textStatus + " ,error=" + errorThrown);
			     	   toastr.error("This user can not be deleted, it has associated data");
			     	}
			    });
		    }
		});

	},
	
	
});