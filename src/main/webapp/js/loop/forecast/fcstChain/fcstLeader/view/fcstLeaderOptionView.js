var forecastLeaderOptionView = Backbone.View.extend({
	
	template : '/blueloop/static/js/loop/forecast/fcstChain/fcstLeader/template/fcstLeaderOption.ejs',

	render : function() {
		this.$el = $(new EJS({url : this.template}).render(this.model.toJSON()));
		return this;
	}

});