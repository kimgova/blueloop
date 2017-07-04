var forecastInstSkuRowView = Backbone.View.extend({
	
	template: '/blueloop/static/js/loop/forecast/fcstInst/fcstInstEditSku/template/skuNewTab/fcstInstSkuRow.ejs',
		
	render: function () {
		this.$el = $(new EJS({url: this.template }).render(this.model.toJSON()));
		this.setEvents();
		return this;
	},
	
	setEvents: function(){
		this.$el.find("#deleteSkuFromIns").click(this,this.deleteSkuFromIns); 
		this.$el.find("#editSkuIns").click(this,this.modifySkuAsso); 
	},
	
	deleteSkuFromIns: function(context) {
		bootbox.confirm("Delete sku from instace, Are you sure?", function (e) {
			if(e){
				var dataReturned = $.ajax({
					type : 'GET',
					url : '/blueloop/fcstSku/deleteSkuFromInstance/',
					data : {id:context.data.model.attributes.skuChain,fcstInst:context.data.model.attributes.fcstInst},
					contentType : 'application/json; charset=utf-8',
					dataType : 'json',
					async : false,
					success : function(data, textStatus) {
						data = data;
					},
					error : function(httpRequest, textStatus, errorThrown) {
						console.log("status=" + textStatus + " ,error=" + errorThrown);
						toastr.error(json.error.tryAgain);
					}
				});

				if(dataReturned.responseJSON){
					toastr.success(json.sku.removed);
					var id = context.data.$el.find("input:checkbox").attr('id');
					$("#tableFCPSkuList").find("#display").find("#"+id).parents("tr").remove();
					$("#tableFCPSkuList").find("#tbodySku").find("#"+id).parents("tr").remove();
					forecastSkuCollection.getInstance({}).remove(context.data.model);
				}
			} else {
				return;
			}
		});
	},

	modifySkuAsso: function(context) {
		var newSkuModalView = new skuNewAddModalView({});
		newSkuModalView.fcInstanceId = context.data.model.attributes.fcstInst;
		newSkuModalView.skuChain = context.data.model.attributes.skuChain;
		newSkuModalView.callFrom = 'modifySkuAsso';
		newSkuModalView.skuModel = context.data.model;
		newSkuModalView.render().$el.modal("show");
	}

});