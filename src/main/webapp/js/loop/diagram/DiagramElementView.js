var DIAGRAM_ELEMENT_VIEW = joint.dia.ElementView.extend({
    events: {
        'mouseover.element'	: 'onMouseover',
        'mouseout.element'	: 'onMouseout',
        'mousedown.element' : 'onRightClick'
    },
        
    onMouseover: function(evt, x, y) {
    	this.addHoverState(this);
    	
    	if(this.model.get("isAltRout")  ){
    		DIAGRAM_FACADE.altRoutController.addLive(this);  
    		DIAGRAM_FACADE.altRoutController.addRouteName(this.model.get('routeId'));
    	}
    },
        
    onRightClick:function(evt){
		if(evt.which == 3){
			if(DIAGRAM_FACADE.isExecutionMode){
				SubmenuController.createSubmenu(this.model.get('id'), 0, evt,this.model.get('formId'),true);
				evt.preventDefault();
				return false;
			}else{
				SubmenuController.createSubmenu(this.model.get('id'),0, evt,this.model.get('formId'),false);
			}
		}
    },
        
    onMouseout: function(evt ){
    	this.addHoverState(this);
     
    	if(this.model.get("isAltRout")  ){
    		DIAGRAM_FACADE.altRoutController.removeLive(this); 
    	}
    	DIAGRAM_FACADE.altRoutController.removeRouteName();
    },
        
    addHoverState:function(element){
      	if(!DIAGRAM_FACADE.isExecutionMode){
      		V(this.paper.findViewByModel(this.model).el).toggleClass('hover');
      	}
    }
        
        
});