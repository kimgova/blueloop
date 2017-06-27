var forecastInstSubCatNewRowView = Backbone.View.extend({

	template: '/blueloop-backend/static/js/loop/forecast/fcstInst/fcstInstEditCat/template/fcstInstSubCatNewRow.ejs',

	constructor : function (options) {
		_.extend(this, options);
	},

	render: function () {
		this.$el = $(new EJS({url: this.template }).render());
		this.$el.find("#saveSubCat").click(this,this.saveSubCat);
		this.$el.find("#cancelSubCat").click(this,this.cancelSubCat);
		return this;
	},

	saveSubCat: function(e){
        //" /^\s*$/ Strings starting with blank, continue with any number of blanks and end with a blank."
        if(e.data.$el.find("#nameSubCat").val() == "" || /^\s*$/.test(e.data.$el.find("#nameSubCat").val())){
            toastr.error(json.forecast.errorNameSubCat);
            return false
        }
		var subCatSaved = JSON.parse(e.data.saveSubCatService(e));
		var model = new forecastSubModel({
			id: subCatSaved.id,
			name: subCatSaved.name,
			status: CATEGORY_STATUS[subCatSaved.status.name],
			categoryId: subCatSaved.skuCategory.id
		});
		var subList = forecastCatCollection.getInstance({}).findWhere({id:subCatSaved.skuCategory.id}).get("subCatList").push(subCatSaved);
		var modelView = new forecastInstSubCatRowView( { model: model } );
		e.data.remove();
		$('#subCatTable tbody').append(modelView.render().$el);
	},

	saveSubCatService: function(e){
		var subCatData = {categoryId:e.data.categoryId,name:e.data.$el.find("#nameSubCat").val(),status:e.data.$el.find("#status").val()};
		var dataReturned = $.ajax({
			type: 'POST',
			url: '/blueloop-backend/fcstCategory/saveSubCatForecast/',
			data: JSON.stringify(subCatData),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			async: false,
			success: function(data, textStatus){
				data = data;
				toastr.success(json.forecast.fcstInstSubCatAdded);
			},
			error: function(httpRequest, textStatus, errorThrown) { 
				console.log("status=" + textStatus + " ,error=" + errorThrown);
				toastr.error(json.error.tryAgain);
			}
		});
		return dataReturned.responseText;
	},

	cancelSubCat: function(e) {
		e.data.remove();
	}

});