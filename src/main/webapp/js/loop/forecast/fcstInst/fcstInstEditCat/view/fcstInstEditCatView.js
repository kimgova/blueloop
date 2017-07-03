var forecastInstEditCatView = Backbone.View.extend({

	template: '/blueloop/static/js/loop/forecast/fcstInst/fcstInstEditCat/template/fcstInstEditCat.ejs',

	constructor : function (options) {
		_.extend(this, options);
	},

	render: function() {
		this.$el = $(new EJS({url: this.template }).render());
		
		var tableView = new forecastInstCatTableView({forecastId: this.forecastId});
		this.$el.find("#primaryCatTable").append(tableView.render().$el);
		
		var subTableView = new forecastInstSubCatTableView({categoryId: 0});
		this.$el.find("#subCatTable").append(subTableView.render().$el);
		
		this.$el.find("#addCatBtn").click(this,this.addCat);
		
		this.$el.find("#addSubCatBtn").click(this,this.addSubCat);
		
		return this;
	},

	addCat: function(e){
		var modelView = new forecastInstCatNewRowView({forecastId:e.data.forecastId});
		e.data.$el.find('#primaryCatTable #no-data-td').remove();
		e.data.$el.find('#primaryCatTable tbody').append(modelView.render().$el);
	},
	
	addSubCat: function(e){
		var modelView = new forecastInstSubCatNewRowView({categoryId:$(e.currentTarget).parent().parent().find("#catId").val()});
		e.data.$el.find('#subCatTable #no-data-td').remove();
		e.data.$el.find('#subCatTable tbody').append(modelView.render().$el);
	}

});