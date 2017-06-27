var forecastWUActEditRowView = Backbone.View.extend({
    
    template: '/blueloop-backend/static/js/loop/forecast/fcstChain/fcstWUAct/template/fcstWUActTableEditRow.ejs',
        
    render: function () {
        this.$el = $(new EJS({url: this.template }).render(this.model.toJSON()));
        this.$el.find("#saveAct").click(this,this.saveAct);
        this.$el.find("#cancelAct").click(this,this.cancelAct);
        this.$el.find("#chooseActImg").click(this,this.chooseActImg);
        return this;
    },
    
    saveAct: function(e){
    	var actSaved = JSON.parse(e.data.saveActService(e));
    	$('#actContent #tableContent').empty()
    	e.data.model.get("activityCollection").findWhere({id:actSaved.id}).set({"name":actSaved.name,"imgUrl":actSaved.fileName})
    	var tableView = new forecastWUActTableView({ model: e.data.model});
    	$('#actContent #tableContent').append(tableView.render().$el);
    },
    
    saveActService: function(e){
    	var actData = {id:e.data.model.id,name:e.data.$el.find("#nameAct").val(),imgUrl:e.data.$el.find("#imgUrlAct").val()};
    	var dataReturned = $.ajax({
	        type: 'POST',
	        url: '/blueloop-backend/fcstWUnit/editWUActivity/',
	        data: JSON.stringify(actData),
	        contentType: 'application/json; charset=utf-8',
	        dataType: 'json',
	        async: false,
	        success: function(data, textStatus) {
	        	data =  data;
	        	toastr.success(json.forecast.forecastWUActEdited);
	        },
	    	error: function(httpRequest, textStatus, errorThrown) { 
	     	   console.log("status=" + textStatus + " ,error=" + errorThrown);
	     	   toastr.error(json.error.tryAgain);
	     	}
	    });
    	return dataReturned.responseText;
    },
    
    cancelAct: function(e) {
    	$('#actContent #tableContent').empty()
    	var tableView = new forecastWUActTableView({ model: e.data.model});
    	$('#actContent #tableContent').append(tableView.render().$el);
    },
    
    chooseActImg: function(e) {
    	$("#image_chooser_modal").remove();	
    	var modalView = new imageChooserModalView({context:e.data, imageType:2});
    	modalView.render().$el.modal({backdrop: 'static',keyboard: false});
    },

    setSelectedImage: function(modelImage){
    	this.$el.find("#imgUrlAct").val(modelImage.get("key"))
    }
    
});