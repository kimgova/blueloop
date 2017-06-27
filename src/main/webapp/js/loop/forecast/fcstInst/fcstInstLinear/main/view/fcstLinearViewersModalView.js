var viewersModalView = Backbone.View.extend({

	template: '/blueloop-backend/static/js/loop/forecast/fcstInst/fcstInstLinear/main/template/fcstLinearViewersModal.ejs',

	constructor : function (options) {
		_.extend(this, options);
	},

	render: function() {
		var data = this.getViewers();
		this.$el = $(new EJS({url: this.template }).render({data:data}));		
		return this;
	},

	getViewers: function(){
		var dataReturned = $.ajax({
			type: 'GET',
			url: '/blueloop-backend/fcstLinearPlan/getLinearPlanningViewers/',
			data: {planningId:this.planningId},
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			async: false,
			success: function(data, textStatus) {
				data = data;
			},
			error: function(httpRequest, textStatus, errorThrown) { 
				console.log("status=" + textStatus + " ,error=" + errorThrown);
				toastr.error(json.error.tryAgain);
			}
		});
		return dataReturned.responseJSON;		
	}
});