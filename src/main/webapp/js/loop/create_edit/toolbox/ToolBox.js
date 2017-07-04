function ToolBox() {

	var that = this;
	that.view = $("#toolbar");
    
	that.init = function() {
		$(that.view).find('.flex').click(btnAction);
    }
    
    function btnAction(e) {
    	switch ($(e.target).attr('id')){    	
    		case "btnTeamwork":
    			teamworkModal.show();
    			break;
    		break;
    		case "btnSku":
    			sku.openDialog();
    		break;
    		case "btnSave":
    			chain.saveChain();
    		break;
    		case "btnRoute":
    			addToggleClass(e.target);
    			$( "#createRoute" ).toggle("fast");
    			$( "#editRoute" ).toggle("fast");
    		break;
    		case "btnZoomIn":
    			window.DIAGRAM_FACADE.zoomIn();
    		break;
    		case "btnZoomOut":
    			window.DIAGRAM_FACADE.zoomOut();
    		break;
    		case "btnQuit":
    			exitDialog.trigger = "toolbox";
    			exitDialog.showDialog();
    		break;
    		case "btnPlay":
    			exitDialog.trigger = "execution";
    			exitDialog.showDialog();
    		break;
    	} 
    }
    
    function addToggleClass(btnView){
    	if(!$(btnView).hasClass("btnClicked")){
			$(btnView).addClass("btnClicked")
		}else{
			$(btnView).removeClass("btnClicked")
		}
    }
    
}

$().ready(function() {
	window.toolbox = new ToolBox();
	toolbox.init();
});
