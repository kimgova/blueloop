function Chain() {
	
	var that = this;
    var id;
    var description;

    that.valvePool = {};
    that.chainBbPool = {};
    that.currentFlowBB = {};
    that.currentValve = "";
    that.currentStockBB = "";
    that.valveDropTemplate = {};
    
    that.init = function() {
    	if (localStorage.getItem('firstTime') == "edit"){
    		that.setId(localStorage.getItem('chainId'));
    		that.getChain();
    	}else{
    		that.openNameDialog("");
    		that.setId(0);
    	}
    	window.teamworkModal = new TeamworkModalView();		
    	teamworkModal.render()
		
		window.sku = new SKUController();
		sku.init();
		window.routeAlt = new AltRouteController();
		routeAlt.init();
		
		window.bbPanelView = new bbPanelView();
		
		that.valveDropTemplate = $(new EJS({url: "/blueloop/static/js/loop/create_edit/view/DropFlowBBFormView.ejs"}).render({}));
	}
    
    that.setId = function(pId){
    	id = pId;
    	localStorage.setItem('chainId',pId);
    }
    
    that.getId = function(){
    	return id;
    }
    
    that.deleteBuildingBlock = function(modelId){
    	delete that.chainBbPool[modelId];
    }
    
    that.openNameDialog = function(name){
    	var data = {modalTitle:json.loop.enterName,name:json.loop.name,value:name,cancelBtn:json.button.cancel,saveBtn:json.button.save};
    	var $template = $(new EJS({url: "/blueloop/static/js/loop/create_edit/view/ChainNameView.ejs"}).render(data));
    	
    	$template.modal({backdrop: 'static',keyboard: false});
    	$template.find("#descriptionChain").focus();
    	
    	$template.delegate("#saveChainName","click", function(e) {
    		that.setDescription($(e.delegateTarget).find("#descriptionChain").val());
    		teamworkModal.setTeamName($(e.delegateTarget).find("#descriptionChain").val() + " Teamwork");
		});
    	
    	$template.delegate("#descriptionChain","keypress", function(e){
    	    if(e.which == 13){
    	    	that.setDescription($(e.delegateTarget).find("#descriptionChain").val());
    	    	$template.modal("hide");
    	    }
    	});
    }
    
    that.setDescription = function(pDescription){
    	if(pDescription != ""){	        		
    		$("#titleChain").fadeOut('slow', function(){
    			localStorage.setItem('chainDescription',pDescription);
    			$("#titleChain").text(pDescription);
    			$("#titleChain").fadeIn('slow');
    		});	
		}
    	description = pDescription;
    }
    
    that.getDescription = function(){
    	
    	if(description != undefined){	
    		return description;
    	}else{
    		return json.loop.untitled;
    	}
    }
    
    that.saveChain = function(){
        var teamworkData = teamworkModal.getDataSave();

        var listAltRoutes = [];
        _.each(window.DIAGRAM_FACADE.altRoutController.getAlternativeRoutes(), function(item, i) {
            listAltRoutes.push({id : item.id, name : item.name })
        });
        
        var listChainBB = [];
        var listRiskRoute = [];
        _.each(that.chainBbPool, function(item, i) {
            listChainBB.push(item)
            for ( var i in item) {
                if (i.substr(0, 4) == 'risk') {
                    listRiskRoute.push({
                        idRisk : i.substr(4),
                        idRoute : item[i]
                    })
                }
            }
        });

        var listValves = [];
        _.each(that.valvePool, function(item, i) {
            var models = selectedFlowActCollection.getInstance({}).where({valve:item.idFormJSON});
            var array = $.map(models, function(value, index) {
                return  value.toJSON();
            });
            listValves.push({
                "idValve"    : item.idFormJSON,
                "listFlowBB" : array,
                "listActivities" : item.listCheckedAct
            })
        });

        var chainData = {id: that.getId(),
                        preview: window.DIAGRAM_FACADE.generateImage(),
                        description: that.getDescription(),
                        diagramJson:window.DIAGRAM_FACADE.save(),
                        listAltRoutes:listAltRoutes,
                        listValves:listValves,
                        listChainBB:listChainBB,
                        listRiskRoute:listRiskRoute,
                        teamwork:{id:teamworkData.id,name:teamworkData.attributes.name,members:teamworkData.members,membersRemove:teamworkData.membersRemove.toJSON()},
                        listSkus:sku.getSkuData()
        };

        var dataReturned = $.ajax({
            type : 'POST',
            url : '/blueloop/chain/saveChain/',
            data : JSON.stringify(chainData),
            contentType : 'application/json; charset=utf-8',
            dataType : 'json',
            async : false,
            beforeSend : function() {
                $("body").addClass("loading");
            },
            success : function(data) {
                that.setId(data.chainIns.id);
                $("#idChain").text(data.chainIns.id);
                teamworkModal.setTeamId(data.chainIns.teamwork.id);
                sku.init();

                _.each(data.listValves, function(valve, i) {
                    _.each(chain.valvePool[valve.idValve].listCheckedAct, function(item, i) {
                        _.each(valve.listActivities, function(item3, j) {
                            if (item.id == item3.id) {
                                item.valve_activ_id = item3.valve_activ_id
                            }
                        });
                    });

                    _.each(valve.listFlowBB, function(item, j) {
                        var model = selectedFlowActCollection.getInstance({}).findWhere({
                                        id_flow_bb:item.id_flow_bb,valve:valve.idValve,id_activity:item.id_activity
                                    });
                        if(model){
                            model.set("valve_flow_id",item.valve_flow_id);
                        }
                    });
                });

                _.each(teamworkData.members.models, function(item, i) {
                    _.each(data.usersToNotify, function(item3, i) {
                        if (item.get("idUser") == item3.user.id) {
                            item.set('teamMember_id', item3.teamMember_id)
                        }
                    });
                });
                teamworkData.membersRemove.reset()
                
                $("body").removeClass("loading");
                toastr.success(json.loop.saved);
            },
            error : function(httpRequest, textStatus, errorThrown) {
                $("body").removeClass("loading");
                console.log("status=" + textStatus + " ,error=" + errorThrown);
                toastr.error(json.error.tryAgain);
            }
        });
    }
    
    that.getChain = function(){
        var dataBB = {};
        var valve;
        var jsonObject = new Object();
        jsonObject.idChain = that.getId();
        var result = ajaxCall('GET', '/blueloop/chain/getChainWithAllData/', jsonObject, "text/json", "json", false);
        window.DIAGRAM_FACADE.loadDiagram(result.diagram,result.haveOrders);
        that.setDescription(result.chain.description);
        
        localStorage.setItem('teamworkId', result.chain.teamwork.id);
        
        _.each(result.listChainBB,function(item,i){
            dataBB.idBB         = item.cbb.buildingBlock.id
            dataBB.alias        = item.cbb.alias
            dataBB.modelId      = item.cbb.idFormJSON
            dataBB.responsible  = item.responsible.user.id
            dataBB.leadTime     = item.cbb.leadTime
            dataBB.leadTimeType = LEADTIME_TYPES[item.cbb.timeUnit.name].value
            _.each(item.listRiskRoutes,function(item2,j){
                dataBB["risk" + item2.risk] = item2.route
            });

            dataBB.type = item.type.toLowerCase();
            chain.chainBbPool[item.cbb.idFormJSON] = dataBB;
            dataBB = {};
        });
        
        selectedFlowActCollection.getInstance({clean:true});
        _.each(result.listChainValve,function(item,i){
            var listActivities = [];
            var listFlowBB = [];
            valve  = new Valve ({id : item.valve.id, idFormJSON:item.valve.idFormJSON, listFlowBB : {}, listCheckedAct : []});
            
            _.each(item.listValveAct,function(item2,j){
                listActivities.push({id:item2.av.activityBB.id, required:item2.av.required, requiredAttachment: item2.av.requiredAttachment, valve_activ_id:item2.av.id, description:item2.av.description,fileName:item2.av.fileName});
            });
            
            valve.listCheckedAct = listActivities;
            
            _.each(item.listFlowBB,function(item3,j){
                var activity = new flowActivityModel({
                    id_activity : item3.id_activity,
                    id_flow_bb  : item3.id_flow_bb,
                    description : item3.description,
                    imgURI      : item3.imgURI,
                    haveOrders  : item3.haveOrders,
                    valve_flow_id : item3.valve_flow_id,
                    leadTime    : item3.leadTime,
                    leadTimeType: LEADTIME_TYPES[item3.leadTimeType.name].value,
                    responsible : item3.responsible.id,
                    rl          : item3.rl,
                    mc          : item3.mc,
                    ra          : item3.ra,
                    valve       : item.valve.idFormJSON,
                    checked     : "checked"
                });
                selectedFlowActCollection.getInstance({}).push(activity); 
            });

            chain.valvePool[item.valve.idFormJSON] = valve;
        });
        
    }
    
    that.getResponsibles = function(){
    	var listResponsibles = [];
    	_.each(that.chainBbPool,function(item,i){
    		listResponsibles.push(item.responsible);
	    });
    	_.each(that.valvePool,function(valve,i){
    	    var listActFlow = selectedFlowActCollection.getInstance({}).where({valve:valve.idFormJSON});
    		_.each(listActFlow,function(flowBB,j){
        		listResponsibles.push(flowBB.get("responsible"));
    	    });
	    });

    	var dataReturned = $.ajax({
	        type: 'POST',
	        url: '/blueloop/chain/getResponsibles/',
	        data: JSON.stringify({listResponsibles:listResponsibles,chain_id:that.getId()}),
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
		
		var dataAjax =  dataReturned.responseJSON;
    	return dataAjax
    }
    
    
    that.getOwners = function(){
    	var listOwners = [];
    	_.each(that.chainBbPool,function(item,i){
    		listOwners.push(item.idBB);
	    });
    	
    	var dataReturned = $.ajax({
	        type: 'POST',
	        url: '/blueloop/chain/getOwners/',
	        data: JSON.stringify({listOwners:listOwners,chain_id:that.getId()}),
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
		
		var dataAjax =  dataReturned.responseJSON;
    	return dataAjax
    }
    
    that.exportChain = function(){
    	
    }
    
    that.printChain = function(){
    	window.print();
    }
    
    return that;
}

