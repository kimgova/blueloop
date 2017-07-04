var Valve = Backbone.Model.extend({

    constructor : function (options) {
		_.extend(this, options);
	},
	
	saveActivities : function (checkedFormInputs,activityCollection,valve_id) {
		var listCheckedAct = [];
		var tempActivities = {};

        var flowCollection = selectedFlowActCollection.getInstance({}).where({valve : valve_id});
        _.each(flowCollection, function(item, i) {
            item.set("mc", false);
            item.set("ra", false);
        });

    	_.each(checkedFormInputs,function(item,i){
    	    var activity = activityCollection.findWhere({id:parseInt(item.name.substr(2))});
    		if(item.name.substr(0,2) == "rl"){
    			tempActivities[item.name.substr(2)] = {};
    			tempActivities[item.name.substr(2)].id = item.name.substr(2);
    			tempActivities[item.name.substr(2)].required = false;
    			tempActivities[item.name.substr(2)].requiredAttachment = false;
    		}else if(item.name.substr(0,2) == "mc"){
    			tempActivities[item.name.substr(2)].required = true;
    		}else if(item.name.substr(0,2) == "ra"){
    			tempActivities[item.name.substr(2)].requiredAttachment = true;
    		}
    		if(activity){
    		    tempActivities[item.name.substr(2)].valve_activ_id = activity.get('valve_activ_id');
    		    tempActivities[item.name.substr(2)].description    = activity.get('description');
    		    tempActivities[item.name.substr(2)].fileName       = activity.get('fileName');
    		}
    		

            var name  = item.name.split("_");
            var model = selectedFlowActCollection.getInstance({}).findWhere({
                            id_flow_bb : parseInt(name[1]), id_activity : parseInt(name[2]), valve : valve_id
                        });
            if (name[0] == "bmc") {
                model.set("mc", true);
            } else if (name[0] == "bra") {
                model.set("ra", true);
            }
	    });
    	
    	_.each(tempActivities,function(item2,i){
    		listCheckedAct.push(tempActivities[item2.id]);
    	});
    	
    	this.listCheckedAct =  listCheckedAct;
		
	},
	
	setActivityChecks : function(activity) {
		_.each(this.listCheckedAct,function(item,i){
			if(item.id == activity.id){
				activity.rl = true;
				activity.mc = item.required;
				activity.ra = item.requiredAttachment;
				activity.valve_activ_id = item.valve_activ_id;
			}
    	});
		return activity;
	},
	
	saveFlowBB : function (formData,flowBBModel) {
		flowBBModel.set({responsible:formData.responsible,leadTime:formData.leadTime,leadTimeType:formData.leadTimeType});
	}
});