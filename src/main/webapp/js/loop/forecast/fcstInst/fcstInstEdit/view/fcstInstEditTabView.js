var forecastInstEditTabView = Backbone.View.extend({
	
	template: '/blueloop/static/js/loop/forecast/fcstInst/fcstInstEdit/template/fcstInstEditTab.ejs',
	
	constructor : function (options) {
		_.extend(this, options);
	},

	render: function() {
		this.$el = $(new EJS({url: this.template }).render());
		this.renderCategoriesTab(this.forecastId);
		this.setEvents();
		return this;
	},
	
	setEvents: function(){
		this.$el.find("#liRoles").click(this,this.renderRolesTab);
		this.$el.find("#liSKUList").click(this,this.renderSkuTab);
		this.$el.find("#liEquivalences").click(this,this.renderEquivalencesTab); 
		this.$el.find("#liLinear").click(this,this.renderLinearTab);
		this.$el.find("#li3s").click(this,this.render3STab); 
		this.$el.find("#liCollab").click(this,this.renderCollaborativeTab); 
	},
	
	renderCategoriesTab: function(forecastId){
		var catView = new forecastInstEditCatView({forecastId:this.forecastId});
		this.$el.find("#categories").append(catView.render().$el);	
	},
	
	renderEquivalencesTab: function(e){
		var equivView = new forecastEquivView({forecastId:e.data.forecastId});
		e.data.$el.find("#equivalences").html(equivView.render().$el);
	},
		
	renderSkuTab: function(e){
		var skuTabView = new forecastInstEditSkuView({fcInstanceId:e.data.instanceId});
		e.data.$el.find("#skulist").html(skuTabView.render().$el);
		skuTabView.setPagination();
		skuTabView.setICheckPlugin();
	},
	
	renderRolesTab: function(e){
		var rolesView = new forecastRoleView({forecastId:e.data.forecastId, instanceId:e.data.instanceId});
		e.data.$el.find("#roles").html(rolesView.render().$el);	
	},
	  
	renderLinearTab: function(e){
		var linearView = new forecastInstLinearView({forecastId:e.data.forecastId, instanceId:e.data.instanceId, instanceName:localStorage.getItem('instanceTitle')});
		e.data.$el.find("#linear").html(linearView.render().$el);	
		$('#linearFilter').find("input:checkbox").iCheck({
			checkboxClass: 'icheckbox_square-blue',
			radioClass: 'iradio_square-blue',
			increaseArea: '20%'
		});
    },
    
    render3STab: function(e){
    	var threeSView = new fcstInst3SView({forecastId:e.data.forecastId, instanceId:e.data.instanceId, instanceName:localStorage.getItem('instanceTitle')});
    	e.data.$el.find("#3s").html(threeSView.render().$el);
    },
	  
	renderCollaborativeTab: function(e){
		var collabTabView = new collaborativeTabView({forecastId:e.data.forecastId, instanceId:e.data.instanceId});
		e.data.$el.find("#collab").html(collabTabView.render().$el);	
		$('#collaborativeFilter').find("input:radio").iCheck({
			checkboxClass: 'icheckbox_square-blue',
			radioClass: 'iradio_square-blue',
			increaseArea: '20%'
		});
		collabTabView.initTreeGrid();
	},

	render3STab: function(e){
		var threeSView = new fcstInst3SView({forecastId:e.data.forecastId, instanceId:e.data.instanceId, instanceName:localStorage.getItem('instanceTitle')});
		e.data.$el.find("#3s").html(threeSView.render().$el);
	},
	
});