var orderValveActivityModalView = Backbone.View.extend({
    
    template: '/blueloop/static/js/loop/execution/order/orderValveActivity/template/valveActModalTemplate.ejs',
    totalAttachments: 0,
    constructor : function (options) {
        _.extend(this, options);
    },

    render: function() {
        this.setTotalAttachments(this.orderRowView.model.get('totalAttach'));
        this.getDataActivities();
        this.$el = $(new EJS({url: this.template }).render());  
        this.setInputActivities();
        this.setOutputActivities();
        this.setFlowBBActivities();
        this.setEvents();
        return this;
    },
 
    getDataActivities: function(){
        var result = ajaxCall('GET', '/blueloop/valve/getActivitiesDataValve/', {idValve:this.actualValve, idOrder:this.idOrder}, "text/json", "json", false);
        this.inputActivities = new orderValveActivityCollection([]);
        this.outputActivities = new orderValveActivityCollection([]);
        this.flowBBActivities = new orderValveActivityCollection([]);
        
        _.each(result,function(item,i){
            var manualCheck, status;
            if(!item.requireManualCheck){
                manualCheck = "disabled";
                status = "checked";
            }else{
                manualCheck = "";
                status = item.status;
            }
            if(!item.isResponsible){
                manualCheck = "disabled";
            }
            
            var activity = new orderValveActivityModel({
                id:item.id,
                idValveOrder: item.idValveOrder,
                description:item.description,
                imagePath:item.imagePath,
                attachments:item.attachments,
                type: item.type,
                status:status,
                requireManualCheck:item.requireManualCheck,
                requireAttachments:item.requireAttach,
                responsible:item.responsible,
                responsibleName:item.responsible.firstName + " " +item.responsible.lastName,
                manualCheck:manualCheck,
                isResponsible:item.isResponsible
            });
            
            switch(item.type) {
            case 0:
                this.inputActivities.push(activity);
                break;
            case 1:
                this.outputActivities.push(activity);
                break;
            case 2:
                this.flowBBActivities.push(activity);
                break;
            } 
            
        },this); 
        
    },

    setEvents: function(){
        this.$el.find("#saveOrderActivities").click(this,this.saveOrderActivities);
    },
    
    setInputActivities: function() {
        if(this.inputActivities.models.length > 0){
            this.$el.find("#inputOrderValveAct").html("");
            this.inputActivities.each(function(model) {
                var activityView = new orderValveActivityView({model:model,parentModal:this});
                this.$el.find("#inputOrderValveAct").append(activityView.render().$el);
            }, this)
        }      
    }, 

    setOutputActivities: function() {
        if(this.outputActivities.models.length > 0){
            this.$el.find("#outputOrderValveAct").html("");
            this.outputActivities.each(function(model) {
                var activityView = new orderValveActivityView({model:model,parentModal:this});
                this.$el.find("#outputOrderValveAct").append(activityView.render().$el);
            }, this)
        }      
    }, 
    
    setFlowBBActivities: function() {
        if(this.flowBBActivities.models.length > 0){
            this.$el.find("#flowbbOrderValveAct").html("");
            this.flowBBActivities.each(function(model) {
                var activityView = new orderValveActivityView({model:model,parentModal:this});
                this.$el.find("#flowbbOrderValveAct").append(activityView.render().$el);
            }, this)
        }      
    }, 

    saveOrderActivities: function(e){
    	var activities = {idValve:e.data.actualValve, idOrder:e.data.idOrder, inputActivities:e.data.inputActivities.models, outputActivities:e.data.outputActivities.models, flowBBActivities:e.data.flowBBActivities.models};
		var dataReturned = $.ajax({
			type: 'POST',
			url: '/blueloop/valve/saveActititiesCheck/',
			data: JSON.stringify(activities),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			async: false,
			success: function(data, textStatus) {
				toastr.success(json.activity.saved);
				if(data.readyToProceed && data.isOrderResponsible){
					e.data.orderRowView.$el.find("#orderProceed").remove();
				    e.data.orderRowView.$el.find("#orderActivities").parent().append("<button id='orderProceed' style='margin-left: 4px' class='btn btn-primary btn-xs'><i class='fa fa-play'></i></button>");
				    e.data.orderRowView.setEvent();
				}
				if(!data.readyToProceed){
				    e.data.orderRowView.$el.find("#orderProceed").remove();
				}
				e.data.$el.modal("hide");		
			},
			error: function(httpRequest, textStatus, errorThrown) {
				toastr.error(httpRequest.responseJSON.error);
		 	}
		});
    },
    
    setTotalAttachments: function(cant){
        if(cant == "subtract"){
            this.totalAttachments = this.totalAttachments - 1;
        }else{
            if(cant > 0){
                this.totalAttachments = this.totalAttachments + cant;
            }
        }
    },
    
    updateAttCount: function(){
        this.orderRowView.updateAttachmentCount(this.totalAttachments);
    }
   
});