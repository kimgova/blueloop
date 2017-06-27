var DIAGRAM_LINK_VIEW = joint.dia.LinkView.extend({
    
    events: {
        'mouseover.element': 'onMouseover',
        'mouseout.element': 'onMouseout',
        'mousedown.element' : 'onRightClick',
        'mouseup.element' : 'onLinkElement',
        'contextmenu' : 'onContextMenu'
    },
    
    onMouseover: function(evt, x, y) {
        if(!DIAGRAM_FACADE.isExecutionMode){
            if(chain.currentFlowBB.model){
                if(chain.currentFlowBB.model.get("category") == "Flow"){
                    if(this.model.get("isAltRout")  ){
                        DIAGRAM_FACADE.altRoutController.addLive(this);
                        DIAGRAM_FACADE.altRoutController.addRouteName(this.model.get('routeId'));
                    }else{
                        var that = this;
                        window.dragInterval=setInterval(function(){
                            
                            window.clearInterval(window.dragInterval);
                            console.info(that.model.get('id'));
                            chain.currentValve= that.model.get('id');
                            DIAGRAM_FACADE.showFlowBBContainer();
                        }, 1000);
                    }
                }
            }
        }
    },
    
    onMouseout: function(evt ){
        if(this.model.get("isAltRout") ){
            DIAGRAM_FACADE.altRoutController.removeLive(this);
        }
        DIAGRAM_FACADE.altRoutController.removeRouteName();
            /*
        if(DIAGRAM_FACADE.isFlowBBContainerShowing){
            DIAGRAM_FACADE.hideFlowBBContainer();    
        }*/
        
        if(window.dragInterval){
            window.clearInterval(window.dragInterval);
        }
    },
        
    onRightClick:function(evt){
        if(DIAGRAM_FACADE.isExecutionMode){
            if(evt.which == 3){
                SubmenuController.createSubmenu(this.model.get('id'),1, evt);
            }
            
            evt.preventDefault();
            return false;
        }
    },

    onContextMenu:function(evt){
         evt.preventDefault(); 
    }
});