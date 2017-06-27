var forecastWUEditRowView = Backbone.View.extend({
    
    template: '/blueloop-backend/static/js/loop/forecast/fcstChain/fcstWU/template/fcstWUTableEditRow.ejs',
        
    render: function () {
        this.$el = $(new EJS({url: this.template }).render(this.model.toJSON()));
        this.$el.find("#saveWU").click(this,this.saveWU);
        this.$el.find("#cancelWU").click(this,this.cancelWU);
        return this;
    },
    
    saveWU: function(e){
    	e.data.saveWUService(e);
    	$('#forecast-wu #wuContent').empty()
    	var tableView = new forecastWUTableView({ forecastId: e.data.model.get("forecastId")});
    	tableView.viewRow = e.data.viewRow;
    	$('#forecast-wu #wuContent').append(tableView.render().$el);
    },
    
    saveWUService: function(e){
    	var wuData = {id:e.data.model.id,name:e.data.$el.find("#nameWU").val()};
    	var dataReturned = $.ajax({
	        type: 'POST',
	        url: '/blueloop-backend/fcstWUnit/editWorkingUnit/',
	        data: JSON.stringify(wuData),
	        contentType: 'application/json; charset=utf-8',
	        dataType: 'json',
	        async: false,
	        success: function(data, textStatus) {
	        	data =  data;
	        	e.data.viewRow.model.set("workingUnits", data[1])
        		e.data.viewRow.updateRow();
	        	toastr.success(json.forecast.forecastWUEdited);
	        },
	    	error: function(httpRequest, textStatus, errorThrown) { 
	     	   console.log("status=" + textStatus + " ,error=" + errorThrown);
	     	   toastr.error(json.error.tryAgain);
	     	}
	    });
    },
    
    cancelWU: function(e) {
    	$('#forecast-wu #wuContent').empty()
    	var tableView = new forecastWUTableView({ forecastId: e.data.model.get("forecastId")});
    	tableView.viewRow = e.data.viewRow;
    	$('#forecast-wu #wuContent').append(tableView.render().$el);
    }

});