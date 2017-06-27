var forecastInstSubCatEditRowView = Backbone.View.extend({
	
	template: '/blueloop-backend/static/js/loop/forecast/fcstInst/fcstInstEditCat/template/fcstInstSubCatEditRow.ejs',

	render: function () {
		this.$el = $(new EJS({url: this.template }).render(this.model.toJSON()));
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
		$('#subCatTable').empty();
		var subList = forecastCatCollection.getInstance({}).findWhere({id:subCatSaved.skuCategory.id}).get("subCatList");
		_.each(subList,function(item,i){
			if(item.id == subCatSaved.id){
				subList[i] = subCatSaved;
			}
		});
		forecastCatCollection.getInstance({}).findWhere({id:subCatSaved.skuCategory.id}).set("subCatList",subList);
		var subTableView = new forecastInstSubCatTableView({ categoryId: subCatSaved.skuCategory.id});
		$("#subCatTable").html(subTableView.render().$el);
	},

	saveSubCatService: function(e){
		var subCatData = {id:e.data.model.id,name:e.data.$el.find("#nameSubCat").val(),status:e.data.$el.find("#status").val()};
		var dataReturned = $.ajax({
			type: 'POST',
			url: '/blueloop-backend/fcstCategory/editSubCatForecast/',
			data: JSON.stringify(subCatData),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			async: false,
			success: function(data, textStatus) {
				data =  data;
				toastr.success(json.forecast.fcstInstSubCatEdited);
			},
			error: function(httpRequest, textStatus, errorThrown) { 
				console.log("status=" + textStatus + " ,error=" + errorThrown);
				toastr.error(json.error.tryAgain);
			}
		});
		return dataReturned.responseText;
	},

	cancelSubCat: function(e) {
		$('#subCatTable').empty()
		var tableView = new forecastInstSubCatTableView({ categoryId: e.data.model.get("categoryId")});
		$('#subCatTable').append(tableView.render().$el);
	}

});