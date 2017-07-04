var Valve = Backbone.Model.extend({

    constructor : function (options) {
		_.extend(this, options);
	},
	
	setActivitiesValve : function (listValveAct,url) {
		
		_.each(listValveAct,function(av,i){
			this.activities[av.av.id] = {"id":av.av.id,"description":av.av.description,"required":av.av.required,"checked":false,"value":"","type":av.av.type,"skus":av.skus,"url":url + av.av.fileName};
			if(av.av.type == 0){
				this.countInAct += 1;
			}else{
				this.countOutAct += 1;
			}
		},this);

	},
	
	setOrdersValve : function (listValveActSaved) {
		
		_.each(listValveActSaved,function(av,i){
			if(this.listOrders[av.avo.orderNumber] == undefined){
				this.listOrders[av.avo.orderNumber] = {number:av.avo.orderNumber,activities:{},flowBBs:[]}; 
				this.listOrders[av.avo.orderNumber].activities[av.avo.activityValve.id] = {id:av.avo.activityValve.id,skus:{}};
				_.each(av.skus,function(sku,i){
					this.listOrders[av.avo.orderNumber].activities[av.avo.activityValve.id].skus[sku.sku.id] = {id:sku.sku.id,val:sku.cantRequired,dev:sku.cantReturned};
				},this);
			}else{
				this.listOrders[av.avo.orderNumber].activities[av.avo.activityValve.id] = {id:av.avo.activityValve.id,skus:{}};
				_.each(av.skus,function(sku,i){
					this.listOrders[av.avo.orderNumber].activities[av.avo.activityValve.id].skus[sku.sku.id] = {id:sku.sku.id,val:sku.cantRequired,dev:sku.cantReturned};
				},this);
			}
		},this);
		
	},
	
	setFLBBValve : function (listFlowBBSaved) {
		
		_.each(listFlowBBSaved,function(flbb,i){
			if(this.listOrders[flbb.orderNumber] == undefined){
				this.listOrders[flbb.orderNumber] = {number:flbb.orderNumber,flowBBs:[{id:flbb.buildingBlock.id}],activities:{}}; 
			}else{
				this.listOrders[flbb.orderNumber].flowBBs.push({id:flbb.buildingBlock.id});
			}
		},this);
		
	},
	
	getOrderDataValve : function (orderNumber) {
		
		var listActivities = [];
		var listFlowBB = [];
		_.each(this.activities,function(activity,i){
			activity.checked = false;
			_.each(activity.skus,function(sku,k){
				if(sku.hasReturn){
					activity.skus[k].sku.value = 0;
					activity.skus[k].sku.dev = 0;
				}else{
					activity.skus[k].sku.value = sku.defValue;
				}
			});
			if(this.listOrders[orderNumber] != undefined){
				_.each(this.listOrders[orderNumber].activities,function(activitySaved,j){
					if(activity.id == activitySaved.id){
						activity.checked = true;
						if(activity.skus.length > 0){
							_.each(activity.skus,function(sku,k){
								if(_.isEmpty(activitySaved.skus[sku.sku.id])){
									if(sku.hasReturn){
										activity.skus[k].sku.value = 0;
										activity.skus[k].sku.dev = 0;
									}else{
										activity.skus[k].sku.value = sku.defValue;
									}
								}else{
									activity.skus[k].sku.value = activitySaved.skus[sku.sku.id].val;
									activity.skus[k].sku.dev = activitySaved.skus[sku.sku.id].dev;
								}
							});
						}
					}
				});
			}
			listActivities.push(activity);
		},this);
		
		_.each(this.listFlowBB,function(flowBB,i){
			flowBB.checked = false;
			if(this.listOrders[orderNumber] != undefined){
				_.each(this.listOrders[orderNumber].flowBBs,function(flBBSaved,j){
					if(flowBB.bb.id == flBBSaved.id){
						flowBB.checked = true;
					}
				});
			}
			listFlowBB.push(flowBB);
		},this);
		
		return {listActivities:listActivities,listFlowBB:listFlowBB,countInAct:this.countInAct,countOutAct:this.countOutAct,countFLBB:this.countFLBB};
		
	},
	
	setDataForm : function (dataForm, tempOrder) {
		
		var listAct = {};
		var listFlowBB = [];
		
		_.each(dataForm,function(item,i){
			if(item.name.substr(0,3) == "act"){
				listAct[item.name.substr(3)] = {id:item.name.substr(3),skus:{}};
    		}else if(item.name.substr(0,3) == "sku"){
    			var res = item.name.split("-");
    			if(listAct[res[1].substr(3)] != undefined){
    				listAct[res[1].substr(3)].skus[res[0].substr(3)] = {id:res[0].substr(3),val:item.value,dev:0};
    			}
    		}else if(item.name.substr(0,3) == "dev"){
    			var res = item.name.split("-");
    			if(listAct[res[1].substr(3)] != undefined){
    				listAct[res[1].substr(3)].skus[res[0].substr(3)].dev = item.value;
    			}
    		}else if(item.name.substr(0,4) == "flbb"){
    			listFlowBB.push({id:item.name.substr(4)});
    		}
	    });
		

		if(this.listOrders[tempOrder] == undefined){
			this.listOrders[tempOrder] = {number:tempOrder,activities:listAct,flowBBs:listFlowBB};
		}else{
			this.listOrders[tempOrder].activities = listAct;
			this.listOrders[tempOrder].flowBBs = listFlowBB; 
		}
		
	}
	
});