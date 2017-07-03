var collaborativeRowView = Backbone.View.extend({
	
	constructor : function (options) {
		_.extend(this, options);
	},
	
	template: '/blueloop/static/js/loop/forecast/fcstInst/fcstCollab/template/fcstInstCollabAdjmtRow.ejs',
		
	render: function () {
		this.$el = $(new EJS({url: this.template }).render(this.model.toJSON()));
		this.setEvents();
		return this;
	},
	
	setEvents: function(){
		this.$el.find("#addAdjmt").click(this,this.addAdjmt); 
		this.$el.find("#addRisk").click(this,this.addRisk); 
	},
	
	addAdjmt: function(e){
    	e.preventDefault();
		$("#collaborative-adjustments-modal").remove();
		var modalView = new fcstCollabAdjModalView({model:e.data.model,collabTable:e.data.collabTable});		
		modalView.render().$el.modal("show");
	},
	
	addRisk: function(e){
		e.preventDefault();
		$("#fcst-collab-risk-modal").remove();
		var modalView = new fcstCollabRisksView({model:e.data.model,collabTable:e.data.collabTable});
		modalView.render().$el.modal("show");
	}

});