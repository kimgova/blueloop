var forecastWUActNewRowView = Backbone.View.extend({
    
    template: '/blueloop/static/js/loop/forecast/fcstChain/fcstWUAct/template/fcstWUActTableNewRow.ejs',
    noDataTemplate: '/blueloop/static/js/loop/forecast/fcstChain/fcstWUAct/template/fcstWUActNoDataRow.ejs',
        
    constructor : function (options) {
		_.extend(this, options);
	},
    
    render: function () {
        this.$el = $(new EJS({url: this.template }).render());
        this.$el.find("#saveAct").click(this,this.saveAct);
        this.$el.find("#cancelAct").click(this,this.cancelAct);
        this.$el.find("#chooseActImg").click(this,this.chooseActImg);
        return this;
    },
    
    saveAct: function(e){
    	var actSaved = JSON.parse(e.data.saveActService(e));
    	var model = new forecastWUActModel({
			id: actSaved.id,
  		  	name: actSaved.name,
  		  	imgUrl: actSaved.fileName,
  		  	filePath: e.data.filePath
  		});
    	e.data.actCollection.add(model);
    	model.set("activityCollection",e.data.actCollection);
    	var modelView = new forecastWUActRowView( { model: model } );
    	e.data.remove();
    	$('#actContent tbody').append(modelView.render().$el);
    },
    
    saveActService: function(e){
    	var actData = {id:e.data.wuId,name:e.data.$el.find("#nameAct").val(),imgUrl:e.data.$el.find("#imgUrlAct").val()};
    	var dataReturned = $.ajax({
	        type: 'POST',
	        url: '/blueloop/fcstWUnit/saveWUActivity/',
	        data: JSON.stringify(actData),
	        contentType: 'application/json; charset=utf-8',
	        dataType: 'json',
	        async: false,
	        success: function(data, textStatus) {
	        	data =  data;
	        	toastr.success(json.forecast.forecastWUActAdded);
	        },
	    	error: function(httpRequest, textStatus, errorThrown) { 
	     	   console.log("status=" + textStatus + " ,error=" + errorThrown);
	     	   toastr.error(json.error.tryAgain);
	     	}
	    });
    	return dataReturned.responseText;
    },
    
    cancelAct: function(e) {
    	e.data.remove();
    	if($("#tableActWU tbody").find("tr").length == 0){
    		$("#tableActWU tbody").append(new EJS({url: e.data.noDataTemplate }).render());
    	}
    },
    
    chooseActImg: function(e) {
    	$("#image_chooser_modal").remove();	
    	var modalView = new imageChooserModalView({context:e.data, imageType:2});
    	modalView.render().$el.modal({backdrop: 'static',keyboard: false});
    },

    setSelectedImage: function(modelImage){
    	this.$el.find("#imgUrlAct").val(modelImage.get("key"))
    },
    
});