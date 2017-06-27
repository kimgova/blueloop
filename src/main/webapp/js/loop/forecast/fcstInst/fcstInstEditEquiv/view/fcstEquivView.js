var forecastEquivView = Backbone.View.extend({

	template: '/blueloop-backend/static/js/loop/forecast/fcstInst/fcstInstEditEquiv/template/fcstEquiv.ejs',

	constructor : function (options) {
		_.extend(this, options);
	},

	render: function() {
		this.$el = $(new EJS({url: this.template }).render());
		
		var tableView = new forecastEquivTableView({forecastId: this.forecastId});
		this.$el.find("#equivalenceTable").append(tableView.render().$el);
		tableView.initPagination();
		
		this.$el.find("#addNewEquiv").click(this,this.addNewEquiv);
		
		return this;
	},
	
	addNewEquiv: function(e){
		console.log("Add New");
	}

});