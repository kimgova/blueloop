var forecastInstEditView = Backbone.View.extend({
	
	template: '/blueloop-backend/static/js/loop/forecast/fcstInst/fcstInstEdit/template/fcstInstEditTemplate.ejs',
	
	constructor : function (options) {
		_.extend(this, options);
	},

	render: function() {
		this.$el = $(new EJS({url: this.template }).render());
		var tabView = new forecastInstEditTabView({forecastId:this.forecastId,instanceId:this.instanceId});
		this.$el.find("#forecastInstContent").append(tabView.render().$el);		
		$("#forecasts").html(this.$el);
		this.setElements();
	},
	
	setElements: function(){
		this.$el.find("#chainTitle").html(localStorage.getItem("chainTitle"))
		this.$el.find("#instanceTitle").html(localStorage.getItem("instanceTitle"))
		this.$el.find("#backBtn").click(this,this.gotoForecastInstanceList);
		this.$el.find("input:checkbox").iCheck({
			checkboxClass: 'icheckbox_square-blue',
			radioClass: 'iradio_square-blue'
		});
		this.$el.find("input:radio").iCheck({
			checkboxClass: 'icheckbox_square-blue',
			radioClass: 'iradio_square-blue'
		});
	},

	gotoForecastInstanceList: function(e) {
		window.location.href = '#forecast/' + e.data.forecastId;
	}

});