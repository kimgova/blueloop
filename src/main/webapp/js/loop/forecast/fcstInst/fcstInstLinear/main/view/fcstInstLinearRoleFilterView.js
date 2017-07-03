var forecastInstLinearRoleFilterView = Backbone.View.extend({

	template: '/blueloop/static/js/loop/forecast/fcstInst/fcstInstLinear/main/template/fcstInstLinearRoleFilter.ejs',

	constructor : function (options) {
		_.extend(this, options);
	},

	render: function () {
		var that = this;
		this.$el = $(new EJS({url: this.template }).render(this.model));
		this.$el.find(".chkFilter").on('ifChecked', function(e){
			that.selectFilter(e);
		});
		this.$el.find(".chkFilter").on('ifUnchecked', function(e){
			that.selectFilter(e);
		});
		return this;
	},
	
	selectFilter: function(e){
		var filterArray = [];
		_.each($(".chkFilter:checked"),function(item,i){
			filterArray.push($(item).val());
		});
		
		var tableView = new forecastInstLinearTableView({instanceId: 0, categoryId:$("#catFilter").val(), subCategoryId:$("#subCatFilter").val(), roleId:$("#rolesFilter").val(), filters:filterArray});
		$("#linearTable").html(tableView.render().$el);
		tableView.initPagination();
	}

});