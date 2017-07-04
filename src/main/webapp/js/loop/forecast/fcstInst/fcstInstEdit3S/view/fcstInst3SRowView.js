var fcstInst3SRowView = Backbone.View.extend({

	template: '/blueloop/static/js/loop/forecast/fcstInst/fcstInstEdit3S/template/fcstInst3SRow.ejs',

	render: function () {
		this.$el = $(new EJS({url: this.template }).render(this.model.toJSON()));
		this.$el.find(".editExport").click(this,this.editExport);
		return this;
	},
	
	editExport: function(e) {
		var modelView = new fcstInst3SEditRowView( { model: e.data.model } );
		if($(e.target).parent().parent().parent().parent().is("tbody")){
			e.data.$el =  $(e.target).parent().parent().parent()
		}else{
			e.data.$el =  $(e.target).parent().parent().parent().parent()
		}
		e.data.$el.html(modelView.render().$el);
	}

});