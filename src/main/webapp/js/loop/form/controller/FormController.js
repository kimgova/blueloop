/** ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 * Form Controller
 * Description: Form Control
 * Date: 10/7/2014
 * +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ 
 */ 
var FormController = {
			
	formPool: {},
		
	createForm:function (pid, ptype, pisEdit, pisExecution,pisNew, pData, pStep, pConfig, pidResponsible, pleadTime, pleadTimeType, porderCount, pactiveRiskCount, pcbbAlertsCount){
		var form  = new AbstractForm ({id : pid, type : ptype, isEdit : pisEdit, isExecution : pisExecution, isNew:pisNew, data:pData, step: pStep, config: pConfig,
									   idResponsible:pidResponsible, leadTime:pleadTime, leadTimeType:pleadTimeType, orderCount:porderCount, activeRiskCount:pactiveRiskCount, cbbAlertsCount:pcbbAlertsCount});
		this.formPool[pid] = form;
	},

	openForm:function (idForm,isNew,modelId,posX,posY,config){
		var isEdit = false
		if(this.formPool[idForm]!=undefined){
			if(isNew){
				this.formPool[idForm].renderWithoutData(posX,posY,config);
			}else{
				if(idForm == modelId){				
					this.formPool[idForm].renderData();
				}else{
					if(modelId != undefined){
						isEdit = true
					}				
					this.formPool[idForm].renderData(undefined,modelId,isNew,isEdit);
				}
			}
		 	
		 	this.formPool[idForm].openDialog();
		}else{
			console.info("cbb no saved");
		}
	},
	
	openFlowBBForm:function (flowBBModel){
		var form  = new AbstractForm ({});
		form.renderFlowBBData(flowBBModel);
		form.openFlowBBDialog(flowBBModel);
	},
	
	openResponsibleForm:function (idBB,px,py,figPalette){
		if(figPalette.model.get("category") == "Flow"){
//		    console.info(figPalette.model.get("category") + " currentValve: " + chain.currentValve);
          var view = new modalActFlowView({model:figPalette.model,valve:chain.currentValve});
          view.render().$el.modal({backdrop: 'static',keyboard: false}); 
		}else{
		    this.formPool["responsible"].renderRespData(idBB,px,py,figPalette);
		    this.formPool["responsible"].openRespDialog();
		}
	},
	
	openValveForm:function (idValve,idFormLeft,idFormRight){
		this.formPool["valve"].renderValveData(idValve,idFormLeft,idFormRight);	 	
	 	this.formPool["valve"].openValveDialog();
	},
	
    openValveEForm : function(idValve, idFormLeft, idFormRight) {
        var modalView = new orderValveModalView();
        modalView.idValve = idValve;
        modalView.idFormLeft = idFormLeft;
        modalView.idFormRight = idFormRight;

        modalView.render().$el.modal({backdrop: 'static',keyboard: false});
    },
	
	openOrderValveForm:function (data){
		this.formPool["valve"].renderValveDataE(data);	 	
	 	this.formPool["valve"].openValveDialogE();
	}

}