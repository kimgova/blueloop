var valveModalView = Backbone.View.extend({
    
    template: '/blueloop/static/js/loop/create_edit/valve/template/valveModal.ejs',
    templateNoDataAct: '/blueloop/static/js/loop/create_edit/valve/template/valveActivityNoData.ejs',
    templateNoDataFlo: '/blueloop/static/js/loop/create_edit/valve/template/valveFlowBBNoData.ejs',
    
    constructor : function (options) {
        _.extend(this, options);
    },

    render: function() {
    	this.$el = $(new EJS({url: this.template }).render());
    	this.setValve();
    	this.getActivities();
    	this.setActivities();
    	this.setFlowBBs();
    	this.setEvents();
        return this;
    },
    
    setValve: function(){
    	if(chain.valvePool[this.valveId] != undefined){
			this.valve = chain.valvePool[this.valveId];
		}else{
			this.valve  = new Valve ({id : this.valveId, idFormJSON : this.valveId, listFlowBB : {}, listCheckedAct : []});
			chain.valvePool[this.valveId] = this.valve;
		}
    },
    
    getActivities: function() {
    	this.activityCollection = new valveActivityCollection([]);
    	var result = ajaxCall('GET', '/blueloop/activityBuildingBlock/getValveActivitiesTest/', {idValve:this.valveId,idSource:this.sourceBBId,idTarget:this.targetBBId}, "text/json", "json", false);
    	_.each(result.activityList,function(item,i){
    	    var valve_activ_id = item.valve_activ_id;
    		var actTemp = this.valve.setActivityChecks(item);
    		var activity = new valveActivityModel({
    			id:item.id,
    			description: item.description,
    			fileName: item.fileName,
    			type: item.type,
    			url: result.url,
    			rl: actTemp.rl,
    			mc: actTemp.mc,
    			ra: actTemp.ra,
    			haveOrders:item.haveOrders,
    			valve_activ_id:valve_activ_id
    		});
    		this.activityCollection.push(activity);
	    },this);
    },
    
    setActivities: function(){
    	var hasInputAct = false
    	var hasOutputAct = false

    	_.each(this.activityCollection.models,function(item,i){
    		if(item.get("type") == 0){
    			hasInputAct = true
    			var actView = new valveActivityView( { model: item } );
                this.$el.find('#input-act-content').append(actView.render().$el);
    		}else{
    			hasOutputAct = true
    			var actView = new valveActivityView( { model: item } );
                this.$el.find('#output-act-content').append(actView.render().$el);
    		}
	    },this);
    	
    	if(!hasInputAct){
    		this.$el.find("#input-act-content").html($(new EJS({url: this.templateNoDataAct }).render()))
    	}
    	if(!hasOutputAct){
    		this.$el.find("#output-act-content").html($(new EJS({url: this.templateNoDataAct }).render()))
    	}
    },
    
    setFlowBBs: function(){
    	var hasFlowBB = false
    	 var models = selectedFlowActCollection.getInstance({}).where({valve:this.valveId});
    	_.each(models,function(item,i){
    		hasFlowBB = true
			var flowView = new valveFlowBBView( { model: item, modalView:this } );
            this.$el.find('#flowbb-content').append(flowView.render().$el);
	    },this);
    	
    	if(!hasFlowBB){
    		this.$el.find("#flowbb-content").html($(new EJS({url: this.templateNoDataFlo }).render()));
    	}
    },
    
    setEvents: function(){
        this.$el.find("#btnSaveValve").click(this,this.saveValve);
    },
    
    saveValve: function(e){
        var myform = e.data.$el.find("form");
        var disabled = myform.find(':input:disabled').removeAttr('disabled');
        var serialized = myform.serializeArray();
        disabled.attr('disabled','disabled');
        
    	e.data.valve.saveActivities(serialized,e.data.activityCollection,e.data.valveId);
    	chain.valvePool[e.data.valveId] = e.data.valve;
    }
    
});