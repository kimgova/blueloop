var forecastInstCatTableView = Backbone.View.extend({

	template: '/blueloop/static/js/loop/forecast/fcstInst/fcstInstEditCat/template/fcstInstCatTable.ejs',

	constructor : function (options) {
		_.extend(this, options);
	},

	render: function() {
		this.$el = $(new EJS({url: this.template }).render());
		this.getCatCollection();
		if(this.collection.length > 0){
			this.$el.find('tbody').empty();
		}
		this.collection.each(this.addModel, this);
		return this;
	},

	getCatCollection: function(){
		if(this.forecastId != 0){
			this.collection = forecastCatCollection.getInstance({clean:true});
			_.each(this.retrieveCategoryList(),function(item,i){
				var model = new forecastCatModel({
					id:item.id,
					name: item.name,
					status: CATEGORY_STATUS[item.status.name],
					subCatList: item.subCatList
				});
				this.collection.add(model);
			},this);
		}else{
			this.collection = forecastCatCollection.getInstance({});
		}
	},

	retrieveCategoryList: function(){
		var dataReturned = $.ajax({
			type: 'GET',
			url: '/blueloop/fcstCategory/getCategories/',
			data: {id:this.forecastId},
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
		var modelView = new forecastInstCatRowView( { model: model } );
		this.$el.find('tbody').append(modelView.render().$el);
	}

});