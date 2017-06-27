var forecastInstCatRowView = Backbone.View.extend({

	template: '/blueloop-backend/static/js/loop/forecast/fcstInst/fcstInstEditCat/template/fcstInstCatRow.ejs',

	render: function () {
		this.$el = $(new EJS({url: this.template }).render(this.model.toJSON()));
		this.setEvents();
		return this;
	},

    setEvents: function(){
        var that = this;
        this.$el.find("#editCat").click(this,this.editCat);
        this.$el.find("#deleteCat").click(this,this.deleteCatInDB); 
        this.$el.find("#selectCat").on('ifChecked', function(e){
            $('.subCatTitle').css('display','block');
            $('#subContent').css('display','block');
            $('#subCatTable').css('display','block');

            $("#subContent").find("#catId").val(that.model.id);
            var subTableView = new forecastInstSubCatTableView({categoryId: that.model.id});
            $("#subCatTable").html(subTableView.render().$el);
            $("#subCatTitle").html("[" + that.model.get("name") + "]");
        });
    },

	deleteCatInDB: function(e) {
		if(forecastCatCollection.getInstance({}).findWhere({id:e.data.model.id}).get("subCatList").length == 0){
			var catData = {id:e.data.model.id};
			var dataReturned = $.ajax({
				type: 'POST',
				url: '/blueloop-backend/fcstCategory/deleteCatForecast/',
				data: JSON.stringify(catData),
				contentType: 'application/json; charset=utf-8',
				dataType: 'json',
				async: false,
				success: function(data, textStatus) {
					e.data.deleteCat(e,data.text);
					toastr.success(json.forecast.fcstInstCatDeleted);
				},
				error: function(httpRequest, textStatus, errorThrown) { 
					console.log("status=" + textStatus + " ,error=" + errorThrown);
					toastr.error(json.error.tryAgain);
				}
		 	});
		}else{
			toastr.error("Error: The category has subcategories associated");
		}
	},
	
	editCat: function(e) {
		var modelView = new forecastInstCatEditRowView( { model: e.data.model } );
		e.data.$el.empty();
		e.data.$el.append(modelView.render().$el);
	},
	
	deleteCat: function(e,text) {
		var model = forecastCatCollection.getInstance({}).findWhere({id:e.data.model.id});
		forecastCatCollection.getInstance({}).remove(model);
		e.data.remove();
		e.data.refreshCatTable();
	},
	
	refreshCatTable: function(){
		$('#primaryCatTable').empty();
		var tableView = new forecastInstCatTableView({ forecastId: 0});
		$('#primaryCatTable').append(tableView.render().$el);
		$("#categories").find("input:radio").iCheck({
			checkboxClass: 'icheckbox_square-blue',
			radioClass: 'iradio_square-blue'
		});
	}

});