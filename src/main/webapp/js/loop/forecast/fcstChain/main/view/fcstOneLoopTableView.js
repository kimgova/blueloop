var forecastTableView = Backbone.View.extend({
	
	constructor : function (options) {
		_.extend(this, options);
	},
	
	template: '/blueloop-backend/static/js/loop/forecast/fcstChain/main/template/fcstOneLoopTable.ejs',

	render: function() {
		this.$el = $(new EJS({url: this.template }).render());
		this.collection.each(this.addModel, this);
		return this;
	},

	addModel: function(model) {
		model.set("forecastPermission", this.forecastPermission);
		var modelView = new forecastRowView( { model: model } );
		this.$el.find('tbody').append(modelView.render().$el);
	}

});