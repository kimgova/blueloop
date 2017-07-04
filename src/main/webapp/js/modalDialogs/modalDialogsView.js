var confirmModalView = Backbone.View.extend({
	template : '/blueloop/static/js/modalDialogs/template/modalTemplate.ejs',

	initialize : function(that) {
		this.$el = $(new EJS({url:this.template}).render(that.model.toJSON()));
		this.callBack = that.callBack;
		this.callBackModel = that.callBackModel;
		this.setEvents();
		
	},
	render : function() {
		this.$el.modal({backdrop: 'static',keyboard: false});
		this.$el.modal("show");
	},
	
	setEvents: function(){
		this.$el.find(".btn-warning").click(this,this.runCallBack);
	},
	
	close : function() {
		this.$el.modal("close");
	},
	runCallBack : function(e) {
		e.data.callBack(e);
	}
});