var fcstCollabAdjModalView = Backbone.View.extend({

	template: '/blueloop/static/js/loop/forecast/fcstInst/fcstCollabAdj/template/fcstCollabAdjModal.ejs',

	constructor : function (options) {
		_.extend(this, options);
	},

	render: function() {
		this.$el = $(new EJS({url: this.template }).render());
    	var tableView = new fcstCollabAdjTableView({ model: this.model});
		this.$el.find("#adjContent").append(tableView.render().$el);
		this.setEvents();
        return this;
	},
	
	setEvents: function(){
		this.$el.find("#closeHeader").click(this,this.closeAdjustmentModal);
		this.$el.find("#closeModal").click(this,this.closeAdjustmentModal);
	},
	
	closeAdjustmentModal: function(e){
		var dataCollabTable = e.data.collabTable;
		var tableView = new collaborativeTableView({instanceId: dataCollabTable.instanceId,filterType:dataCollabTable.filterType,unit:dataCollabTable.unit,isDefault:dataCollabTable.isDefault});
		$("#adjustmentsTable").html(tableView.render().$el);
		tableView.initTreeGrid();
	}
});