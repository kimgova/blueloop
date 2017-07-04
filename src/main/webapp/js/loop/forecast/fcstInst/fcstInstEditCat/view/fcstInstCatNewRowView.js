var forecastInstCatNewRowView = Backbone.View.extend({
    
    template: '/blueloop/static/js/loop/forecast/fcstInst/fcstInstEditCat/template/fcstInstCatNewRow.ejs',
        
    constructor : function (options) {
		_.extend(this, options);
	},
    
    render: function () {
        this.$el = $(new EJS({url: this.template }).render());
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
		var model = new forecastCatModel({
			id: catSaved.id,
			name: catSaved.name,
			status: CATEGORY_STATUS[catSaved.status.name]
		});
		forecastCatCollection.getInstance({}).add(model);
		var modelView = new forecastInstCatRowView( { model: model } );
		e.data.remove();
		$('#primaryCatTable tbody').append(modelView.render().$el);
		$("#categories").find("input:radio").iCheck({
			checkboxClass: 'icheckbox_square-blue',
			radioClass: 'iradio_square-blue'
		});
	},

	saveCatService: function(e){
		var catData = {forecastId:e.data.forecastId,name:e.data.$el.find("#nameCat").val(),status:e.data.$el.find("#status").val()};
		var dataReturned = $.ajax({
	        type: 'POST',
	        url: '/blueloop/fcstCategory/saveCatForecast/',
	        data: JSON.stringify(catData),
	        contentType: 'application/json; charset=utf-8',
	        dataType: 'json',
	        async: false,
	        success: function(data, textStatus) {
	        	data =  data;
	        	toastr.success(json.forecast.fcstInstCatAdded);
	        },
	    	error: function(httpRequest, textStatus, errorThrown) { 
	     	   console.log("status=" + textStatus + " ,error=" + errorThrown);
	     	   toastr.error(json.error.tryAgain);
	     	}
	    });
    	return dataReturned.responseText;
    },
    
    cancelCat: function(e) {
    	e.data.remove();
    }

});