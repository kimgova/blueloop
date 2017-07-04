var forecastInstActView = Backbone.View.extend({
    
    template: '/blueloop/static/js/loop/forecast/fcstInst/fcstInstAct/template/fcstInstActTemplate.ejs',
    
    constructor : function (options) {
		_.extend(this, options);
	},
    
    render: function() {
        this.$el = $(new EJS({url: this.template }).render());
        this.getActivities();
        if(this.collection.length > 0){
        	this.$el.find('#instActContent').empty();
        }
        this.collection.each(this.addModel, this);
        return this;
    },

    addModel: function(model) {
        var modelView = new forecastInstActRowView( { model: model } );
 		this.$el.find('#instActContent').append(modelView.render().$el);
    },
    
    getActivities: function(){
    	var data = {instanceId:this.instanceId,forecastId:this.forecastId};
    	var dataReturned = $.ajax({
	        type: 'GET',
	        url: '/blueloop/fcstWUnitActiv/getAllIntanceActivities/',
	        data: data,
	        contentType: 'application/json; charset=utf-8',
	        dataType: 'json',
	        async: false,
	        success: function(data, textStatus) {
	        	data =  data;
	        },
	    	error: function(httpRequest, textStatus, errorThrown) { 
	     	   console.log("status=" + textStatus + " ,error=" + errorThrown);
	     	   toastr.error(json.error.tryAgain);
	     	}
	    });
    	
    	this.setCollection(dataReturned.responseJSON)
    },
    
    setCollection: function(listActivities){
    	this.collection = new forecastInstActCollection([]);
    	_.each(listActivities,function(item,i){ 
    		item = this.setDisabledProperty(item,listActivities);
    		item = this.setStatusProperty(item);
    		item = this.setAuthorizedProperty(item);
    		var model = new forecastInstActModel({
    			id:item.activity.id,
      		  	name: item.activity.name,
      		  	imgUrl: item.activity.fileName,
      		  	status: item.activity.status,
      		  	step: item.activity.step,
      		  	dependencies:item.dependencies,
      		  	disabled:item.activity.disabled,
      		  	filePath:item.filePath,
      		  	responsible:item.responsible.name,
      		  	authorized:item.activity.authorized,
      		  	instanceId:this.instanceId,
      		  	forecastId:this.forecastId
      		});
    		this.collection.add(model);
	    },this);
    },
    
    setDisabledProperty: function(item,listActivities){
    	var disabled = false;
    	if(item.dependencies.length > 0){
    		var total = item.dependencies.length;
    		var count = 0;
	    	_.each(item.dependencies,function(dep,i){
	    		_.each(listActivities,function(act,j){
		    		if(dep.id == act.activity.id && act.activity.status != ""){
		    			count += 1;
		    		}
	    		});
		    });
	    	if(total != count){
	    		disabled = true;
	    	}
    	}
    	item.activity["disabled"] = disabled;
    	return item;
    },
    
    setStatusProperty: function(item){
		if(item.activity.status == 1){
			item.activity["status"] = "checked";
		}else{
			item.activity["status"] = "";
		}
		return item;
    },
    
    setAuthorizedProperty: function(item){
    	var isAuthorized = false;
    	_.each(item.members,function(member,i){
    		if(member == item.currentUser){
    			isAuthorized = true
    		}  		
	    });
    	item.activity["authorized"] = isAuthorized;
    	return item;
    },

});