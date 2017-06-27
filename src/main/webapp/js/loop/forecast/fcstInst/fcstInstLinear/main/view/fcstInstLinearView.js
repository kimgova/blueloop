var forecastInstLinearView = Backbone.View.extend({

	template: '/blueloop-backend/static/js/loop/forecast/fcstInst/fcstInstLinear/main/template/fcstInstLinear.ejs',

	constructor : function (options) {
		_.extend(this, options);
	},

	render: function() {
		this.$el = $(new EJS({url: this.template }).render({title:this.instanceName}));

		var filterView = new forecastInstLinearFilterView({instanceId: this.instanceId});
		this.$el.find("#linearFilter").append(filterView.render().$el);
		
		var tableView = new forecastInstLinearTableView({instanceId: this.instanceId});
		this.$el.find("#linearTable").append(tableView.render().$el);
		tableView.initPagination();
		
		return this;
	}

});