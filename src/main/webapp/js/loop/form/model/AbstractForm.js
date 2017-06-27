/** ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 * Form Controller
 * Description: AbstractForm
 * Date: 10/7/2014
 * +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ 
 */ 
var AbstractForm = Backbone.Model.extend({
	
	constructor : function (options) {
		_.extend(this, options);
		this.cbb ={};
	},
	
	template : {
	    valve_edit:  			'/blueloop-backend/static/js/loop/form/view/FormValve.ejs',	    
	    valve_consult: 			'/blueloop-backend/static/js/loop/form/view/FormValveE.ejs',
 		bb_edit: 	 			'/blueloop-backend/static/js/loop/form/view/FormBB.ejs',
 		bb_consult:	 			'/blueloop-backend/static/js/loop/form/view/FormBBC.ejs',
 		bb_flow_edit:	 		'/blueloop-backend/static/js/loop/form/view/FormFlowBB.ejs',
 		resp_select: 			'/blueloop-backend/static/js/loop/form/view/FormResponsible.ejs'
	},
	
	renderData : function (pData,modelId,pIsNew,pIsEdit) {
		
		if(!this.isExecution){
			this.modelId = modelId;
			
			var listAltRoutes = [];
			_.each(window.DIAGRAM_FACADE.altRoutController.getAlternativeRoutes(),function(item,i){
				listAltRoutes.push({id:item.id,name:item.name})
		    });
			
			var pData	= this.getDataForm(this.id);

			var buildingBlock  = new BuildingBlock ({bb : pData.bb, cbb: chain.chainBbPool[this.modelId],
			                                        listMembers : pData.listMembers,daysOff : pData.daysOff,risks : pData.risks, 
		                                            listAltRoutes:listAltRoutes,isNew:pIsNew,isEdit:pIsEdit,idResponsible:this.idResponsible,
		                                            listLeadTimeTypes:this.convertObjToArray(LEADTIME_TYPES),
		                                            leadTime:chain.chainBbPool[this.modelId].leadTime,
		                                            leadTimeType:chain.chainBbPool[this.modelId].leadTimeType,
		                                            alias:chain.chainBbPool[this.modelId].alias});
			
			if(!pData.config){
				buildingBlock.bb.config = JSON.parse("{}");
			}else{
				buildingBlock.bb.config = JSON.parse(pData.config);
			}
			$("#modalProcessEdit").remove();	
			this.$el = $(new EJS({url: this.template["bb_edit"] }).render(buildingBlock));
			
		}else{
		    
			var pData	= this.getDataForm('bb_' + this.data[4].id);
			var leadTimeType = "";
			_.each(LEADTIME_TYPES,function(item,i){
				if(item.value == this.leadTimeType){
					leadTimeType = item.text;
				}
		    },this);
			var buildingBlock  = new BuildingBlock ({bb : pData.bb, cbb: this.data[0], responsible : this.data[3], 
													 daysOff : pData.daysOff, inventory : pData.inventory, leadTime:this.leadTime, leadTimeType: leadTimeType});
			if(!pData.config){
				buildingBlock.bb.config = JSON.parse("{}");
			}else{
				buildingBlock.bb.config = JSON.parse(pData.config);
			}
			$("#modalProcessEdit").remove();		
			this.$el = $(new EJS({url: this.template["bb_consult"] }).render(buildingBlock));

		}	
		
	},
	
	renderFlowBBData : function (flowBBModel) {
		this.flowBBModel = flowBBModel;
		var pData	= this.getDataForm('bb_' + flowBBModel.get("id_flow_bb"));
			
		var buildingBlock = new BuildingBlock ({bb : pData.bb, listMembers : pData.listMembers,daysOff : pData.daysOff,risks : pData.risks, 
			idResponsible:flowBBModel.get("responsible"),listLeadTimeTypes:this.convertObjToArray(LEADTIME_TYPES),leadTime:flowBBModel.get("leadTime"),
			leadTimeType:flowBBModel.get("leadTimeType"),act_name:flowBBModel.get("description"),imgURI:flowBBModel.get("imgURI")});
		
		if(pData.config == "{}"){
			buildingBlock.bb.config = undefined;
		}else{
			buildingBlock.bb.config = JSON.parse(pData.config);
		}
		
		$("#modalFlowBBEdit").remove();
		this.$el = $(new EJS({url: this.template["bb_flow_edit"] }).render(buildingBlock));
		
	},
	
	renderWithoutData : function (posX,posY,config) {
		this.posX = posX;
		this.posY = posY;
		
		var buildingBlock  = new BuildingBlock ({bb : {config:config}, listMembers : [], daysOff : [], risks : [], listAltRoutes:[],isNew:true,isEdit:false});
		
		var dataCountries = ajaxCall('GET','/blueloop-backend/city/getCountries/', null, "text/json", "json", false);		
		buildingBlock.countries	= dataCountries.countries;
		
		if(dataCountries.defaultCountry != null){
		    buildingBlock.defCountryAreaCode= dataCountries.defaultCountry.areaCode;
		}else{
		    buildingBlock.defCountryAreaCode = "";
		}
		buildingBlock.listTypes = this.convertObjToArray(LEADTIME_TYPES);
		$("#modalProcessEdit").remove();

		this.$el = $(new EJS({url: this.template["bb_edit"] }).render(buildingBlock));
		this.setCountriesEventListener();
	},
	
	setCountriesEventListener : function(){
		$(document).off("change", "#selectAreaCode");
		$(document).on("change", "#selectAreaCode", function() {
			$("#phoneNumberAreaCode").val($("#selectAreaCode").val());
	    });
	},
	
	renderValveData : function (idValve,idFormLeft,idFormRight) {
		this.idValve = idValve;
		var valve;
		
		if(chain.valvePool[idValve] != undefined){			
			valve = chain.valvePool[idValve];
			valve.setDataActivities(idFormLeft,idFormRight);
			valve.setCheckedActivities(false);
		}else{
			valve  = new Valve ({id : idValve, idFormJSON : idValve, listIdFlowBB : [], listFlowBB : {}, listIncomingAct : [], listOutgoingAct : [], listCheckedAct : []});
			chain.valvePool[idValve] = valve;
			valve.setDataActivities(idFormLeft,idFormRight);
			valve.setCheckedActivities(true);
		}
		this.$el = $(new EJS({url: this.template[this.type+"_edit"] }).render(valve));
	},
	
	renderValveDataE : function (data) {
		this.$el 		= $(new EJS({url: this.template["valve_consult"] }).render(data));
	},
	
	renderRespData : function (idBB,px,py,figPalette) {
		this.idForm = idBB;
		this.px = px;
		this.py = py;
		this.figPalette = figPalette;
		var data 	= new Object();
		data.idBB	= idBB.substr(3);
		var members = ajaxCall('GET','/blueloop-backend/teamwork/getMembersByBB/', data, "text/json", "json", false);
		data.listMembers = members;
		data.listTypes = this.convertObjToArray(LEADTIME_TYPES);
		this.$el = $(new EJS({url: this.template["resp_select"] }).render(data));
	},
	
	validateFields:function(e){
		var that = e;
		$(e.data.$el).find("form").validate({
			debug: true,
		 	rules: {
		 		name: {
		 			required: true
			 	}	
		 	},
			success: "valid",
			submitHandler: function(form,data) {
				that.data.onSaveBuildingBlock(that);
				$(that.data.$el).modal('hide');
			}
		});
		
	},
	
	onSaveBuildingBlock:function(e){
		var dataBB;
		if(e.data.isNew){
			dataBB = $(e.data.$el).find("form").serializeArray();
			dataBB.push({name:"type",value:e.data.id.substr(4)});
			
			var dataReturned = $.ajax({
		        type: 'GET',
		        url: '/blueloop-backend/buildingBlock/saveBBFromCreate/',
		        data: dataBB,
		        contentType: "text/json",
		        dataType: "json",
		        async: false,
		        success: function(data, textStatus) {
		        	data =  data;
		        },
		    	error: function(httpRequest, textStatus, errorThrown) { 
		     	   console.log("status=" + textStatus + " ,error=" + errorThrown);
		     	}
		    });

			var dataReturned = dataReturned.responseJSON;
			var config = JSON.parse(String.fromCharCode.apply(null, new Uint16Array(dataReturned.bb.config)))
			FormController.createForm("cb_"+dataReturned.bb.id, e.data.type, true, false,false, {}, 0, config, dataReturned.bb.creator.id, dataBB.leadTimeBB, dataBB.typeLeadTimeBB);
			
    		var modelId = window.DIAGRAM_FACADE.createBuildingBlock(dataReturned.filePath + dataReturned.bb.fileName,{x:e.data.posX,y:e.data.posY}, dataReturned.bb.name,"cb_"+dataReturned.bb.id,e.data.type,1);
    		var form = $(e.data.$el).find("form").serializeObject();
    		var newbb = new Object();  
    		newbb.idBB         = dataReturned.bb.id;
    		newbb.leadTime     = form.leadTimeBB;
    		newbb.leadTimeType = form.typeLeadTimeBB;
    		newbb.modelId      = modelId;
    		newbb.responsible  = dataReturned.bb.creator.id;
    		newbb.type         = "buildingblock";
    		newbb.alias        = 1;
    		
    		chain.chainBbPool[modelId] = newbb;
    		
		}else{
			dataBB = $(e.data.$el).find("form").serializeObject();
			dataBB.modelId = e.data.modelId;
			dataBB.type = e.data.type;
			dataBB.alias = parseInt(dataBB.alias);
			chain.chainBbPool[e.data.modelId] = dataBB;
		}
	},
	
	onSaveFlowBB:function(e){
		var valve  = chain.valvePool[e.data.flowBBModel.get("valve")];
		valve.saveFlowBB($(e.data.$el).find("form").serializeObject(),e.data.flowBBModel);
		chain.valvePool[e.data.idValve] = valve;
	},
	
	onSaveValve:function(e){
		var valve  = chain.valvePool[e.data.idValve];
		valve.saveActivities($(e.data.$el).find("form").serializeArray());
		chain.valvePool[e.data.idValve] = valve;
	},
	
    onSaveResponsible:function(e){
        var figPalette = e.data.figPalette;
        var data = $(e.data.$el).find("form").serializeArray();
        if(e.data.figPalette.model.get("category") == "Stock" && e.data.validLeadTime(data[1].value)){
            figPalette.finalizeStockDrop(e.data.idForm,e.data.px,e.data.py,data[0].value,data[1].value,data[2].value);
            e.data.$el.modal().remove();
        }    
    },
	
	onSaveValveE:function(e){
		var dataValve = $(e.data.$el).find("form").serializeArray();
	},
	
	getDataForm:function (idForm){
		var dataReturned = {};
		var jsonBB 	= new Object();
		jsonBB.id   = idForm.substr(3);
			
		dataReturned = $.ajax({
	        type: 'GET',
	        url: '/blueloop-backend/buildingBlock/getBBData/',
	        data: jsonBB,
	        contentType: "text/json",
	        dataType: "json",
	        async: false,
	        success: function(data, textStatus) {
	        	data =  data;
	        },
	    	error: function(httpRequest, textStatus, errorThrown) { 
	     	   console.log("status=" + textStatus + " ,error=" + errorThrown);
	     	}
	    });
		
		return dataReturned.responseJSON;
	},
	
	openDialog:function(){
		this.$el.modal({backdrop: 'static',keyboard: false});
		$(this.$el).find("#saveBBData").click(this,this.validateFields);
		$(this.$el).find(".default-date-picker").datepicker();
	},
	
	openFlowBBDialog:function(){
		this.$el.modal({backdrop: 'static',keyboard: false});
		$(this.$el).find("#saveBBData").click(this,this.onSaveFlowBB);
		$(this.$el).find(".default-date-picker").datepicker();
	},
	
	openRespDialog:function(){
		this.$el.modal({backdrop: 'static',keyboard: false});
		$(this.$el).find("#saveRespData").click(this,this.onSaveResponsible);
		$(this.$el).find('[data-toggle="popover"]').popover();
	},
	
	openValveDialog:function(){
	    console.info("openValveDialog");
		this.$el.modal({backdrop: 'static',keyboard: false});
		$(this.$el).find("#btnSaveValve").click(this,this.onSaveValve);
		$(this.$el).find("input:checkbox").iCheck({
	 	    checkboxClass: 'icheckbox_square-blue',
	 	    radioClass: 'iradio_square-blue',
	 	    increaseArea: '20%' 
	 	});
		$(this.$el).find(".btnOpenFLBB").click(this,this.openFLBBDialog);
		$(this.$el).find(".btnDelFLBB").click(this,this.onDeleteFLBB);
//		$(this.$el).find(".default-date-picker").datepicker();
	},
	
	onDeleteFLBB:function(e){
		e.preventDefault();
		var idFlBB = $(e.currentTarget).parents(".col-md-5").find("#idFlowBB").text();
		chain.deleteBuildingBlock(e.data.idValve + "-" + idFlBB);
		chain.valvePool[e.data.idValve].deleteFlowBB(idFlBB);
		$(e.currentTarget).parent().remove();
	},
	
	openFLBBDialog:function(e){
	    console.info("openFLBBDialog");
		e.preventDefault();
		var idFlBB = $(e.currentTarget).parents(".col-md-5").find("#idFlowBB").text();
		FormController.openForm("cb_"+idFlBB,false,e.data.idValve + "-" + idFlBB,0,0,"");
	},
	
	openValveDialogE:function(){
		this.$el.modal({backdrop: 'static',keyboard: false});
		$(this.$el).find("#btnSaveValve").click(this,this.onSaveValveE);
		$(this.$el).find("input:checkbox").iCheck({
	 	    checkboxClass: 'icheckbox_square-blue',
	 	    radioClass: 'iradio_square-blue',
	 	    increaseArea: '20%' 
	 	});
		$(this.$el).find("input:checkbox").on('ifUnchecked', function(event){
			bootbox.confirm(json.valve.confirmUncheck, function (e) {
				if ( !e ){
					$(event.currentTarget).iCheck('check');
				}
			});
		});
	},

	convertObjToArray: function(obj){
		var array = $.map(obj, function(value, index) {
		    return [value];
		});
		
		return array;
	},
	
    validLeadTime : function(option){
        var regexNum    = /^(\d|-)?(\d|,)*\.?\d*$/;
        var regexBlank  = /^\s*$/;
        var regexNumPositive = /^([0-9])*[.]?[0-9]*$/;
        
        if(option.trim() == "" || regexBlank.test(option)){
            $("#leadTimeBB").parent().addClass("has-error");
            toastr.error(json.flowActivities.errorEmptyLeadTime);
            return false;
        }
        
        if (!regexNum.test(option.trim())){
            $("#leadTimeBB").parent().addClass("has-error");
            toastr.error(json.flowActivities.errorNumericLeadTime);
            return false;
        }
        
        if (!regexNumPositive.test(option.trim())){
            $("#leadTimeBB").parent().addClass("has-error");
            toastr.error(json.flowActivities.errorPositiveLeadTime);
            return false;
        }
        
        if (option == 0){
            $("#leadTimeBB").parent().addClass("has-error");
            toastr.error(json.flowActivities.errorZeroLeadTime);
            return false;
        }
        
        return true;
    }

	
});
