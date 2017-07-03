var fcstInst3SView = Backbone.View.extend({

	template: '/blueloop/static/js/loop/forecast/fcstInst/fcstInstEdit3S/template/fcstInst3S.ejs',

	constructor : function (options) {
		_.extend(this, options);
	},

	render: function() {
		this.$el = $(new EJS({url: this.template }).render({title:this.instanceName}));
		
		var filterView = new fcstinst3SFilterView({instanceId: this.instanceId,forecastId:this.forecastId});
		this.$el.find("#3sFilter").append(filterView.render().$el);
		
		var tableView = new fcstInst3STableView({instanceId: this.instanceId, roleId: 0, fromEdit: false});
		this.$el.find("#3sTable").append(tableView.render().$el);
		tableView.initPagination();
		
		return this;
	}

});