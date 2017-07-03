var forecastLeaderSelectView = Backbone.View.extend({
	template : '/blueloop/static/js/loop/forecast/fcstChain/fcstLeader/template/fcstLeaderSelect.ejs',

	render : function() {
		this.$el = $(new EJS({url: this.template }).render());
		if (this.collection.length > 0) {
			this.$el.find('#selectLeaders').empty();
		}
		this.collection.each(this.addModel, this);
		this.setMultipleSelect();
		return this;
	},

	addModel : function(model) {
		var optionView = new forecastLeaderOptionView({model : model});
		this.$el.append(optionView.render().$el);
	},
	
	setMultipleSelect: function(){
		var that = this;
		this.$el.multiSelect({
			afterSelect: function(values){
				that.saveLeader(that.model.idForecast,values[0], that.model);
			},
			afterDeselect: function(values){
				that.deleteLeader(that.model.idForecast,values[0], that.model);
			}
		});
	},
	
	saveLeader: function(forecastId, userId, model){
		var memberData = {forecastId:forecastId,userId:userId};
		var dataReturned = $.ajax({
			type: 'POST',
			url: '/blueloop/forecast/saveLeader/',
			data: JSON.stringify(memberData),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			async: false,
			success: function(data, textStatus) {
				data = data;
				toastr.success(json.forecast.forecastLeaderAdded);	
				model.updateModel(data[0], model.viewRow)
			},
			error: function(httpRequest, textStatus, errorThrown) { 
				console.log("status=" + textStatus + " ,error=" + errorThrown);
				toastr.error(json.error.tryAgain);
			}
		});
	},

	deleteLeader: function(forecastId, userId, model){
		var memberData = {forecastId:forecastId,userId:userId};
		var dataReturned = $.ajax({
			type: 'POST',
			url: '/blueloop/forecast/deleteLeader/',
			data: JSON.stringify(memberData),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			async: false,
			success: function(data, textStatus) {
				data =  data;
				model.updateModel(data[1], model.viewRow)
				toastr.success(json.forecast.forecastLeaderRemoved);
			},
			error: function(httpRequest, textStatus, errorThrown) { 
				console.log("status=" + textStatus + " ,error=" + errorThrown);
				toastr.error(json.error.tryAgain);
			}
		});
	}, 
	
});