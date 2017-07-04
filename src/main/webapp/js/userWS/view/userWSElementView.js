var userWSElementView = Backbone.View.extend({
    
    template: '/blueloop/static/js/userWS/template/userWSElementViewTemplate.ejs',
    
    render: function() {
    	this.$el = $(new EJS({url: this.template }).render(this.model.toJSON()));
    	this.setEvents();
        return this;
    },
    
	setEvents: function(){
	    this.$el.find(".ws-pic").parents(".bb-element").click(this,this.goToBB);		
		this.$el.find(".ws-pic").parents(".loop-element").click(this,this.goToExecution);		
	},
	
	goToBB: function(e){
		var access = e.data.getBBAccess(e.data.model.get("id"));
		if(access.allowAccessLink == true){
			 setTimeout(function(){window.location.replace("/blueloop/buildingBlock/list")}, 500);
		}else{
			var modalView = new bbAccessNoAllowedView({model:e.data.model});
	        modalView.render().$el.modal({backdrop: 'static',keyboard: false});
		}
	},
	
	getBBAccess : function(idBB){
        var jsonObject = new Object();       
        jsonObject.idBB = idBB; 

        var dataReturned = $.ajax({
            type: 'GET',
            url: '/blueloop/buildingBlock/getCurrentUserBBAccess/',
            data: jsonObject,
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
        return dataReturned.responseJSON; 
    },
    
    goToExecution:function(context){
        if(context.data.model.get("allowAccess")){
             setTimeout(function(){window.location.replace("/blueloop/chain/execution/"+ context.data.model.get("id"))}, 500);
        }else{
            var modalView = new loopAccessView({model:context.data.model});
            modalView.render().$el.modal("show");
        }
    }
    
});