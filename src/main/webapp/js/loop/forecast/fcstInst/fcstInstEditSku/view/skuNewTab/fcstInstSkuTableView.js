var forecastInstSkuTableView = Backbone.View.extend({
	
	template: '/blueloop/static/js/loop/forecast/fcstInst/fcstInstEditSku/template/skuNewTab/fcstInstSkuTable.ejs',
	
	constructor : function (options) {
		_.extend(this, options);
	},

	render: function() {
		this.$el = $(new EJS({url: this.template }).render());
		this.getSkuCollection();
		if(this.collection.length > 0){
			this.$el.find('tbody').empty();
		}

		this.collection.each(this.addModel, this);
		return this;
	},
	
	getSkuCollection: function(){
		if(this.fcInstanceId != 0){
			this.collection = forecastSkuCollection.getInstance({clean:true});
			_.each(this.retrieveSkuList(),function(item,i){
				var promo = ''
				if(item.promotion && item.promotion != 'null'){
					promo = 'checked'
				}
				var model = new forecastSkuModel({
					id:item.id,
					identifier:item.identifier,
					description:item.description,
					type:item.type,
					brand:item.brand,
					family:item.family, 
					promotion:promo,
					skuChain:item.skuChain,
					fcstInst:item.fcstInst,
					unit:item.unit,
					skuAssociateList:item.skuAssociateList
				});
				this.collection.add(model);
			},this);
		}else{
			this.collection = forecastSkuCollection.getInstance({});
		}
	},
	
	retrieveSkuList: function(){
		var dataReturned = $.ajax({
			type: 'GET',
			url: '/blueloop/fcstSku/getSkuInstanceList/',
			data: {id:this.fcInstanceId},
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
	},

	addModel: function(model) {
		var modelView = new forecastInstSkuRowView( { model: model } );
		this.$el.find('tbody').append(modelView.render().$el);
	}
	
});