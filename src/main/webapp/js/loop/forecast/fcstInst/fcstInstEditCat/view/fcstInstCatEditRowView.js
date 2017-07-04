var forecastInstCatEditRowView = Backbone.View.extend({
	
	template: '/blueloop/static/js/loop/forecast/fcstInst/fcstInstEditCat/template/fcstInstCatEditRow.ejs',

	render: function () {
		this.$el = $(new EJS({url: this.template }).render(this.model.toJSON()));
		this.$el.find("#saveCat").click(this,this.saveCat);
		this.$el.find("#cancelCat").click(this,this.cancelCat);
		return this;
	},

	saveCat: function(e){
        //" /^\s*$/ Strings starting with blank, continue with any number of blanks and end with a blank."
        if(e.data.$el.find("#nameCat").val() == "" || /^\s*$/.test(e.data.$el.find("#nameCat").val())){
            toastr.error(json.forecast.errorNameCat);
            return false
        }
		var catSaved = JSON.parse(e.data.saveCatService(e));
		$('#primaryCatTable').empty()
		forecastCatCollection.getInstance({}).findWhere({id:catSaved.id}).set({"name":catSaved.name,"status":catSaved.status})
		var tableView = new forecastInstCatTableView({ forecastId: 0});
		$('#primaryCatTable').append(tableView.render().$el);
		$("#categories").find("input:radio").iCheck({
			checkboxClass: 'icheckbox_square-blue',
			radioClass: 'iradio_square-blue'
		});
	},

	saveCatService: function(e){
		var catData = {id:e.data.model.id,name:e.data.$el.find("#nameCat").val(),status:e.data.$el.find("#status").val()};
		var dataReturned = $.ajax({
			type: 'POST',
			url: '/blueloop/fcstCategory/editCatForecast/',
			data: JSON.stringify(catData),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			async: false,
			success: function(data, textStatus) {
				data =  data;
				toastr.success(json.forecast.fcstInstCatEdited);
			},
			error: function(httpRequest, textStatus, errorThrown) { 
				console.log("status=" + textStatus + " ,error=" + errorThrown);
				toastr.error(json.error.tryAgain);
			}
		});
		return dataReturned.responseText;
	},

	cancelCat: function(e) {
		$('#primaryCatTable').empty()
		var tableView = new forecastInstCatTableView({ forecastId: 0});
		$('#primaryCatTable').append(tableView.render().$el);
        $("#primaryCatTable").find("input:radio").iCheck({
            checkboxClass: 'icheckbox_square-blue',
            radioClass: 'iradio_square-blue'
        });
	}

});