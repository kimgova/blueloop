var forecastInstSubCatRowView = Backbone.View.extend({
    
    template: '/blueloop/static/js/loop/forecast/fcstInst/fcstInstEditCat/template/fcstInstSubRow.ejs',
        
    render: function () {
        this.$el = $(new EJS({url: this.template }).render(this.model.toJSON()));
        this.$el.find("#editSubCat").click(this,this.editSubCat);
        this.$el.find("#deleteSubCat").click(this,this.deleteSubCatInDB);
        return this;
    },

	deleteSubCatInDB: function(e) {
		var catData = {id:e.data.model.id};
		var dataReturned = $.ajax({
			type: 'POST',
			url: '/blueloop/fcstCategory/deleteSubCatForecast/',
			data: JSON.stringify(catData),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			async: false,
			success: function(data, textStatus) {
				e.data.deleteSubCat(e,data.text);
				toastr.success(json.forecast.fcstInstSubCatDeleted);
			},
			error: function(httpRequest, textStatus, errorThrown) { 
				console.log("status=" + textStatus + " ,error=" + errorThrown);
				toastr.error(json.error.tryAgain);
			}
		});
	},

	editSubCat: function(e) {
		var modelView = new forecastInstSubCatEditRowView( { model: e.data.model } );
		e.data.$el.empty();
		e.data.$el.append(modelView.render().$el);
	},
	
	deleteSubCat: function(e,text) {
		if(text == "success"){
			var subList = forecastCatCollection.getInstance({}).findWhere({id:e.data.model.get("categoryId")}).get("subCatList");
			_.each(subList,function(item,i){
				if(item.id == e.data.model.id){
					subList.splice(i,1);
				}
			});
			forecastCatCollection.getInstance({}).findWhere({id:e.data.model.get("categoryId")}).set("subCatList",subList);
			e.data.remove();
		}else{
			toastr.error("Error: The subCategory has sku's associated");
		}
	}

});