$( document ).ready( function(){
	$("button").tooltip({
		show: null,
		position: {	my: "left top",	at: "left bottom"},
		open: function( event, ui ) {
			ui.tooltip.animate({ top: ui.tooltip.position().top + 10 }, "fast" );
		}			
    });

	//File uploader attributes
	$('.qq-upload-button').attr("class","btn btn-primary");
	$('.qq-upload-drop-area').remove(); 	
	$("#btnFileSystemChooser .qq-uploader > div").addClass("dropbox-dropin-btn btn");
	$("#btnFileSystemChooser .qq-uploader > div").append(new EJS({url: '/blueloop-backend/static/js/ejsTemplates/btnsUploaders.ejs'}).render({type:"faUpload"}));


    //Data preparation to load this module
	createFormBB();
	
	window.DIAGRAM_FACADE = new DiagramFacade({isExecutionMode:true});
	window.DIAGRAM_FACADE.createDiagram("#canvas");
	window.DIAGRAM_FACADE.setExecutionLayer(EXECUTION_MODES.GENERAL);
	
	localStorage.setItem('chainDescription',null);
	localStorage.setItem('firstTime',null);
	localStorage.setItem('chainId','0');
	localStorage.setItem('teamworkId',null);
	localStorage.setItem('teamworkDescription',null);
	localStorage.setItem('teamworkName',null);

    var toolbox = new ToolBox();
    toolbox.init();
    
    var tabLayers = new TabLayers();
    tabLayers.init();
    tabLayers.setGeneralView();

    createFormValves();
});

function createFormBB(){
	var jsonObjectChain = new Object();
	jsonObjectChain.idChain = $("#idChain").text();	
	$.ajax({
        type: 'GET',
        url: '/blueloop-backend/chainBuildingBlock/getChainBuildingBlocks/',
        data: jsonObjectChain,
        contentType: "text/json",
        dataType: "json",
        async: false,
        success: function(buildingBlockList) {
        	$.each(buildingBlockList, function(i, item){
        		if(item.cbbdata[0]!=undefined){
        			FormController.createForm(
        					item.cbbdata[0].idFormJSON, 
        					item.cbbdata[4].type, 
        					false, 
        					true, 
        					false,
        					item.cbbdata, 
        					item.cbbdata[0].step, 
        					item.cbbdata[4].config, 
        					item.cbbdata[0].responsible.id,
        					item.cbbdata[0].leadTime,
        					LEADTIME_TYPES[item.cbbdata[0].timeUnit.name].value,
        					item.totalOrders, item.totalActiveRisks, item.totalCbbAlerts);	
        		}
        	});
        },
    	error: function(httpRequest, textStatus, errorThrown) { 
     	   console.log("status=" + textStatus + " ,error=" + errorThrown);
     	}
    });
}

function createFormValves(){ 	
	FormController.createForm("valve", "valve", true,false,false,{},0);
}