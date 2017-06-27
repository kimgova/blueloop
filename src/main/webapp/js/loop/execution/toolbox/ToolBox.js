function ToolBox() {

    var that = this;
    var buttons = [];

    that.init = function() {
        that.view = $("#toolbar");       
        setToolboxButtons();
    };

    function setToolboxButtons() {
        $(that.view).find('.flex').each(function(i,btn){
            $(btn).click(function(){
                getBtnAction(this);
            });
            buttons.push(btn);
        })
        $(that.view).find('button').each(function(i,btn){
        	$(btn).click(function(){
        		getBtnAction(this);
        	});
            buttons.push(btn);
        })
        
        $(that.view).find('input').each(function(j,inpt){
        	$(inpt).click(function(){
        		getBtnAction(this);
        	});
            buttons.push(inpt);
        })
    }
    
    function getBtnAction(button) {
    	switch ($(button).attr('id'))
		{
		case "btnExport":
			break;
		case "btnZoomIn":
			DIAGRAM_FACADE.zoomIn();
			break;
		case "btnZoomOut":
			DIAGRAM_FACADE.zoomOut();
			break;
		case "btnForecast":
			localStorage.setItem("loopId",$("#idChain").text().trim());
			break;
		 case "btnSequence":
			var idChain = $("#idChain").text().trim();
			$("#sequence-modal").remove();		
			var modalView = new SequenceModalView({idLoop:idChain});
			modalView.render().$el.modal("show");
			break;
		 case "btnOrders":
			 var modalView = new orderModalView({idChain:$("#idChain").text().trim(),isResponsible:$(button).attr("responsible")});		
			 modalView.render().$el.modal({backdrop: 'static',keyboard: false});
			 break;
		 case "checkboxAllRoutes":
			 if ($(button).attr('checked')){
				 window.DIAGRAM_FACADE.altRoutController.showAltRoute();
			 }else{
				 window.DIAGRAM_FACADE.altRoutController.hideAltRoute();
			 }
			 break;				
		} 
    }
    
    return that;
}