var forecastInstanceNewRowView = Backbone.View.extend({
	
	template: '/blueloop/static/js/loop/forecast/fcstInst/main/template/fcstInstNewRow.ejs',
		
	constructor : function (options) {
		_.extend(this, options);
	},
	
	render: function () {
		this.$el = $(new EJS({url: this.template }).render());
		this.$el.find("#saveInstance").click(this,this.saveNewInstance);
		this.$el.find("#cancelInstance").click(this,this.cancelNewInstance);
		return this;
	},
	
	saveNewInstance: function(e){
		if(e.data.validate(e.data.$el.find("#nameInstance").val())){
			var newinstance = e.data.saveInstance(e.data);
			var tableView = new forecastInstanceTableView({ forecastId: e.data.forecastId});
			$('#tableInstancesContent').html(tableView.render().$el);
			tableView.setPagination();
		}		
	},
	
	saveInstance: function(data){		
		var instance = {idForecastChain:data.forecastId,name:data.$el.find("#nameInstance").val()};
		var dataReturned = $.ajax({
			type: 'POST',
			url: '/blueloop/forecast/saveForecastInstance/',
			data: JSON.stringify(instance),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			async: false,
			success: function(data, textStatus) {
				data =  data;
				toastr.success(json.forecast.forecastPlanningAdded);
			},
			error: function(httpRequest, textStatus, errorThrown) { 
				toastr.error(httpRequest.responseJSON.error);
		 	}
		});
		var result = JSON.parse(dataReturned.responseText)
		return result;	
	},
	
	validate: function(planningName){
		var valid = true;
		if(planningName.trim() == "" || /^\s*$/.test(planningName)){
			toastr.error(json.error.errorEmptyInstanceName);
			valid = false;
		}
		return valid;
	},
	
	cancelNewInstance: function(e) {
		e.data.remove();
	}

});