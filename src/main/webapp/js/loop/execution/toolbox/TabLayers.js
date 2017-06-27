function TabLayers() {

    var that = this;
    var buttons = [];

    that.init = function() {
        that.view = $(".tabbable-line.layers");       
        setTabButtons();
    };

    function setTabButtons() {
        $(that.view).find('li').each(function(i,btn){
        	$(btn).click(function(){
        		getBtnAction(this);
        	});
            buttons.push(btn);
        })
    }
    
    function setActiveClass(button) {
    	$(that.view).find('li').removeClass("active");
    	$(button).addClass("active");
    }
    
    function getBtnAction(button) {
    	switch ($(button).attr('id')){
		case "1":			
			that.setGeneralView();			
			break;
		case "2":	
			that.setRiskView();
			break;
		}
    }
    
    that.getDiagram = function() {
    	idChain= $("#idChain").text();
    	var jsonObjectChain = new Object();
    	jsonObjectChain.idChain = idChain;	
    	var result = ajaxCall('GET', '/blueloop-backend/chain/getDiagram/', jsonObjectChain, "text/json", "json", false);
    	var Diagram = JSON.stringify(result);
    	return Diagram;
    }
    
    function getActiveRoutes() {
    	idChain= $("#idChain").text();
    	var jsonObjectChain = new Object();
    	jsonObjectChain.idChain = idChain;	
    	var activeRoutes = ajaxCall('GET', '/blueloop-backend/chain/getActiveRoutes/', jsonObjectChain, "text/json", "json", false);
    	return activeRoutes; 
    }

    that.setGeneralView = function(){
    	$("#titleView").html(json.execution.generalView);
    	$(".bbAlert").remove();
    	$(".popover.fade").remove();
		$("label").filter($("#lblcheckboxAllRoutes")).css("display","none");	
//		$("label").filter($("#resilienceIndex")).css("display","none");			
		    	
		setActiveClass($(that.view).find('li.tabLayer#1'));
		
    	window.DIAGRAM_FACADE.setExecutionLayer(EXECUTION_MODES.GENERAL);
		window.DIAGRAM_FACADE.loadDiagram(that.getDiagram());
		
		var activeRoutes = getActiveRoutes();
		$.each(activeRoutes, function(i, route){
			window.DIAGRAM_FACADE.altRoutController.showAltRoute(route.idJSON);			 
		});	
		
		toastr.success(json.execution.generalView);
    }
    
    that.setRiskView = function(){    	
    	$("#titleView").html(json.execution.riskManagement);		
		$("label").filter($("#lblcheckboxAllRoutes")).css("display","block");
		$("input").filter($("#checkboxAllRoutes")).attr("checked","true");
//		$("label").filter($("#resilienceIndex")).css("display","inline");
		
		setActiveClass($(that.view).find('li.tabLayer#1'));

		window.DIAGRAM_FACADE.setExecutionLayer(EXECUTION_MODES.RESILIENCE);
		window.DIAGRAM_FACADE.loadDiagram(that.getDiagram());
		window.DIAGRAM_FACADE.altRoutController.showAltRoute();
		
		toastr.success(json.execution.riskManagement);
    }
    
    return that;
}