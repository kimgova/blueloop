var forecastInstLinearSubCatOptionView = Backbone.View.extend({

	template: '/blueloop-backend/static/js/loop/forecast/fcstInst/fcstInstLinear/main/template/fcstInstLinearSubCatOption.ejs',

	constructor : function (options) {
		_.extend(this, options);
	},

	render: function () {
		var that = this;
		this.$el = $(new EJS({url: this.template }).render(this.model));
		return this;
	}

});