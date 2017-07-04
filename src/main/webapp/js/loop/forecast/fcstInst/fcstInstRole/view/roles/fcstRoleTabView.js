var forecastRoleTabView = Backbone.View.extend({
	
	template: '/blueloop/static/js/loop/forecast/fcstInst/fcstInstRole/template/roles/forecastRoleTab.ejs',
	
	constructor : function (options) {
		_.extend(this, options);
	},

	render: function() {
		this.$el = $(new EJS({url: this.template }).render());
		this.renderRoleUsersTab(this.instanceId, this.roleId);
		this.setEvents();
		return this;
	},
	
	setEvents: function(){
		this.$el.find("#liRoleSkus").click(this,this.renderRoleSkusTab);
		this.$el.find("#liRoleFilter").click(this,this.renderRoleFiltersTab); 
	},
	
	renderRoleUsersTab: function(instanceId, roleId){
		var tableView = new userForecastRoleTableView();
    	tableView.instanceId = instanceId;
    	tableView.roleId =  roleId;
    	this.$el.find("#roleUsers").html(tableView.render().$el);
	},
	
	renderRoleSkusTab: function(e){
		var treeView = new forecastRoleSkuView({instanceId:e.data.instanceId, roleId:e.data.roleId});
		e.data.$el.find("#roleSkus").html(treeView.render().$el);
	},
		
	renderRoleFiltersTab: function(e){
		var tableView = new forecastRoleFilterTableView();
    	tableView.instanceId = e.data.instanceId;
    	tableView.roleId =  e.data.roleId;
    	e.data.$el.find("#roleFilters").html(tableView.render().$el);
    	
    	tableView.setICheck();
    	tableView.setPagination();
   	},

});