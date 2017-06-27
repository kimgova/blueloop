var SubmenuController = {
		
	showConnectedBB : true,
	
	/* pid = Id Form (cbb), evt = event,  ptype= 0(BB), 1(valve) */
	createSubmenu:function (pid, ptype, evt, formId, isExec){
		
		$( "#submenu"+pid).remove();
		$(".subMenuBB").css("display", "none");
		var submenu = "";
		var connectedLabel = json.submenu.showConnectedBB;
		if(!this.showConnectedBB){
			connectedLabel = json.submenu.hideConnectedBB;
		}
				
		if(ptype==0){ // BB submenu
			submenu = new EJS({url: '/blueloop-backend/static/js/ejsTemplates/submenu.ejs'}).render({pid:pid,ptype:ptype,formId:formId,isExec:isExec,connectedLabel:connectedLabel});			
		}		
		$("#canvas").append($(submenu));
    	$("#submenu"+pid).css({'display':'block', 'left':evt.pageX, 'top':evt.pageY});   
		this.setlistener();		
	},	
	
	createChat: function(pid,ptype){
		if(ptype != 1){	//type = BB		 	  		 	  	 		    
			var jsonCBB 	      = new Object();
			jsonCBB.idformJSON 	  = pid;
			jsonCBB.idchain 	  = $("#idChain").text();
			var dataCBB          = ajaxCall('GET', '/blueloop-backend/chainBuildingBlock/getDataCBB/', jsonCBB, "text/json", "json", false);
			//Parameters: bbName, cbbId, bbId, chainId			
			chat.showBBChatGroupDialog(dataCBB[0][0].name, dataCBB[0][1].id,"",$("#idChain").text());
			
 	  	}else{ //! type = Valve
 	  		chat.showLoopChatGroupDialog($("#idChain").text());
 	  	} 		    
	},
	
	viewCBBAlerts: function(pid){
		var modalView = new alertModalView({cbbJsonId:pid, idChain:$("#idChain").text().trim()});		
		modalView.render().$el.modal("show");
	},
	
	viewAttachments: function(pid){
		$('.qq-upload-list').html("");
		$("#AttachForm").modal("show");
		FormAttachmentController.getAttachaments(pid);
	},
	
	viewConnectedBB: function(pid){
		if(this.showConnectedBB){
			var listConnectedBB = SubmenuController.getAllConnectedBB(pid.substr(3));
			var listBB = [];
			_.each(listConnectedBB.bbList,function(item,i){
				listBB.push("cb_" + item.bbObject.id);
		    });
			
			window.DIAGRAM_FACADE.showConnected(listBB);
			this.showConnectedBB = false;
		}else{
			window.DIAGRAM_FACADE.hideConnected();
			this.showConnectedBB = true;
		}
		
	},
	
    getAllConnectedBB: function(idBB){
    	var jsonBB 	= new Object();
    	jsonBB.myBB = idBB;
    	jsonBB.searchWord = "";
    	jsonBB.filter = "connected";
    	
    	var dataReturned = $.ajax({
	        type: 'GET',
	        url: '/blueloop-backend/buildingBlock/getBBbySearchWord/',
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
	
	viewCBBOrders: function(pid){
		var modalView = new orderCBBModalView({idFormCBB:pid});		
		 modalView.render().$el.modal("show");
	},
	
	setlistener: function() {
		$(document).click(function(e){  
	          if(e.button == 0){ //click
	          	$(".subMenuBB").css("display", "none");
	          }
	    });    
	    $(document).keydown(function(e){
	          if(e.keyCode == 27){ //esc
	                $(".subMenuBB").css("display", "none");
	          }
	    });
	}
}