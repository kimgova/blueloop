var collaborativeTabView = Backbone.View.extend({

	template: '/blueloop/static/js/loop/forecast/fcstInst/fcstCollab/template/fcstInstCollabAdjmtTab.ejs',

	constructor : function (options) {
		_.extend(this, options);
	},

	render: function() {
		this.$el = $(new EJS({url: this.template }).render());
		this.setFirstTimeFilters();
		this.$el.find("#editFilter").click(this,this.openFilters);
		this.setEquivFilters();
		this.tableView = new collaborativeTableView({instanceId: this.instanceId,filterType:2});
		this.$el.find("#adjustmentsTable").append(this.tableView.render().$el);
		return this;
	},
	
	openFilters: function(e){
		e.preventDefault();
		$("#collab-filter-modal").remove();
		var unit = $('input[name="chkFilterEquiv"]:checked').val();
		var data = fcstCollabEquivCollection.getInstance({}).findWhere({unit:unit});
		var modalView = new collaborativeFilterView({instanceId: e.data.instanceId,unit:unit,isDefault:data.get("isDefault")});
		modalView.render().$el.modal("show");
	},
	
	setFirstTimeFilters: function(){
		var filterList = [{id:1,name:"Category",step:1},{id:2,name:"SubCategory",step:2},{id:3,name:"Role",step:3}];
		fcstCollabFilterCollection.getInstance({clean:true});
		_.each(filterList,function(item,i){ 
			var model = new fcstCollabFilterModel({
				id:item.id,
				name: item.name,
				step: item.step,
				tag:i+1
			});
			fcstCollabFilterCollection.getInstance({}).add(model);
		},this);
	},
	
	setEquivFilters: function(){
		var modelView = new equivToolbarView({instanceId:this.instanceId});
		this.$el.find('#btn-row').append(modelView.render().$el);
	},
	
	initTreeGrid: function(){
		this.tableView.initTreeGrid();
	}

});