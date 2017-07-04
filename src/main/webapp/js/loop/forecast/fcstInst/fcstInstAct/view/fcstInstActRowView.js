var forecastInstActRowView = Backbone.View.extend({
	
	template: '/blueloop/static/js/loop/forecast/fcstInst/fcstInstAct/template/fcstInstActRow.ejs',
		
	render: function () {
		this.$el = $(new EJS({url: this.template }).render(this.model.toJSON()));
		this.setICheckPlugin();
		return this;
	},
	
	setICheckPlugin: function(){
		var that = this;
		this.$el.find("input:checkbox").iCheck({
	 		checkboxClass: 'icheckbox_square-blue',
	 		radioClass: 'iradio_square-blue',
	 		increaseArea: '20%' 
	 	});
		this.$el.find("input:checkbox").on('ifChecked', function(e){
			that.changeActivityStatus(that.model.get("instanceId"),$(e.currentTarget).attr('id'),ACTIVITY_STATUS.CHECKED,that.model.get("forecastId"));
			that.reloadInstActView();
		});
		this.$el.find("input:checkbox").on('ifUnchecked', function(e){
			that.changeActivityStatus(that.model.get("instanceId"),$(e.currentTarget).attr('id'),ACTIVITY_STATUS.UNCHECKED,that.model.get("forecastId"));
			that.reloadInstActView();
		});
	},
	
	changeActivityStatus: function(instanceId,id,status,forecastId){
		var actData = {instanceId:instanceId,id:id,status:status};
		var dataReturned = $.ajax({
			type: 'POST',
			url: '/blueloop/fcstWUnitActiv/changeStatus/',
			data: JSON.stringify(actData),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			async: false,
			success: function(data, textStatus) {
				data =  data;
				toastr.success(json.general.successfullySaved);
				//
				var tableView = new forecastInstanceTableView({ forecastId:forecastId});
		    	$('#tableInstancesContent').html(tableView.render().$el);
		    	tableView.setPagination();
			},
			error: function(httpRequest, textStatus, errorThrown) { 
		 	   console.log("status=" + textStatus + " ,error=" + errorThrown);
		 	   toastr.error(json.error.tryAgain);
		 	}
		});
	},
	
	reloadInstActView: function(){
		$("#forecast-inst-act").find('.panel-body #content').remove();
		var modelView = new forecastInstActView({instanceId:this.model.get("instanceId"),forecastId:this.model.get("forecastId")});
		$("#forecast-inst-act").find('.panel-body').append(modelView.render().$el);
	}

});