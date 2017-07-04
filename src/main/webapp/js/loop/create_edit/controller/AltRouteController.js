function AltRouteController() {
	
    var that = this;
    that.activeRoute;
  
    that.init = function() {
    	$("#editRoute").click(setEditMode);
        $("#createRoute").click(setCreationMode);
        $("#saveRoute").click(openNewRouteDialog);
        $("#doneRoute").click(doneEditRouteClick);
    }

    function setCreationMode(){
    	DIAGRAM_FACADE.altRoutController.toogleAlternateRoutingMode();
    	$("#createRoute").toggle("fast");
        $("#editRoute").toggle("fast");
        $("#saveRoute").toggle("fast");
    }

    function setEditMode(){
    	var data = {routes:window.DIAGRAM_FACADE.altRoutController.getAlternativeRoutes(),modalTitle:json.route.selectAlternative,defaultRoute:json.route.select,editBtn:json.button.accept,cancelBtn:json.button.cancel}
    	var $template = $(new EJS({url: "/blueloop/static/js/loop/create_edit/view/EditAltRouteView.ejs"}).render(data));
    	$template.modal("show");
    	$("#editAltRoute").click(onEditRouteClick);
    	$template.delegate("#editAltRoute","click", function(e) {
    		onEditRouteClick(e);
    	});
    }

    function openNewRouteDialog(){
    	var data = {modalTitle:json.route.enterName,routeName:json.route.name,saveBtn:json.button.accept,cancelBtn:json.button.cancel}
    	var $template = $(new EJS({url: "/blueloop/static/js/loop/create_edit/view/CreateAltRouteView.ejs"}).render(data));
    	$template.modal("show");
    	$template.delegate("#saveRouteName","click", function(e) {
    		onSaveRouteClick(e);
    	});
    }

    function onSaveRouteClick(e){
    	$(e.delegateTarget).find("#saveRouteName").off("click");
    	DIAGRAM_FACADE.altRoutController.saveAltrRoute($(e.delegateTarget).find("#routeName").val());
    	$("#createRoute").toggle("fast");
        $("#editRoute").toggle("fast");
        $("#saveRoute").toggle("fast");
        DIAGRAM_FACADE.altRoutController.toogleAlternateRoutingMode();
    }

    function onEditRouteClick(e){
    	that.activeRoute = $(e.delegateTarget).find("#altroute").val();
    	DIAGRAM_FACADE.altRoutController.toogleAlternateRoutingMode();
    	DIAGRAM_FACADE.altRoutController.toogleEditAltRoute(that.activeRoute);
    	$("#createRoute").toggle("fast");
        $("#editRoute").toggle("fast");
        $("#doneRoute").toggle("fast");
        
    }

    function doneEditRouteClick(e){
    	console.log(that.activeRoute)
    	DIAGRAM_FACADE.altRoutController.toogleAlternateRoutingMode();
    	DIAGRAM_FACADE.altRoutController.toogleEditAltRoute(that.activeRoute);
    	$("#createRoute").toggle("fast");
        $("#editRoute").toggle("fast");
        $("#doneRoute").toggle("fast");
    }
	
	    
}