var AlternativeRouteController = Backbone.Model.extend({
	
	initialize : function(options) {
		_.extend(this, options);
		this.altRoutinMode = false;
		this.currentRoutElements = new Array();
		this.altRoutes = {};
		this.altRouteNameDisplay=$( "<div id='routName'></div>" ).appendTo( "body" );
	},
	fetchPrevAltRouts : function (){
		
		var cells = [] ;
		cells= cells.concat(window.DIAGRAM_FACADE.graph.getElements());
		cells = cells.concat(window.DIAGRAM_FACADE.graph.getLinks());
		
		_.each(cells , function(cell, i){
			if(cell.has("routeId")){
				if(this.altRoutes[cell.get("routeId") ]){
					this.altRoutes[cell.get("routeId") ].elements.push(cell);
				}else{
					this.altRoutes[cell.get("routeId") ] = {"name":cell.get("routeName"), "id":cell.get("routeId"), "elements":[cell] }; 
				}
				 V((DIAGRAM_FACADE.paper.findViewByModel(cell)).el).addClass('alt');
			}
			
		},this);
	},
	
	generateID : function() {

		return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);

	},
	getAlternativeRoutes : function() {
		return  this.altRoutes;
	},
	deleteRoute:function(id){
		if(this.altRoutes[id]){
			_.each(this.altRoutes[id].elements,function(cell,i){
				cell.remove();
			});
			delete this.altRoutes[id];
		}
	},
	renameRoute:function(id,newName){
		console.log(id);
		console.log(newName);
		this.altRoutes[id].name=newName;
	},
	toogleAlternateRoutingMode:function(){
    	this.altRoutinMode = !this.altRoutinMode ;
    	V(this.paper.el).toggleClass('altrouting');
    	
    },
    toogleEditAltRoute:function(id){
    	this.editMode = !this.editMode;
    	if(this.altRoutes[id]){
	    	if(this.editMode){
	    		this.currentRoutOnEdit = id;
		    	V(this.paper.el).addClass('editing');
		    	_.each(this.altRoutes[id].elements,function(cell,i){
					 	V((DIAGRAM_FACADE.paper.findViewByModel(cell)).el).addClass('active');
				});
	    	
	    	}else{
	    		this.currentRoutOnEdit = null;
	    		V(this.paper.el).removeClass('editing');
		    	_.each(this.altRoutes[id].elements,function(cell,i){
					 	V((DIAGRAM_FACADE.paper.findViewByModel(cell)).el).removeClass('active');
				});
	    	}
    	}
    },
    onCellAdded:function(cell){
    	if(this.altRoutinMode){
    		cell.set("isAltRout",true);
    		V((DIAGRAM_FACADE.paper.findViewByModel(cell)).el).addClass('alt');
    		if(this.editMode){
    			this.altRoutes[this.currentRoutOnEdit].elements.push(cell)
    			V((DIAGRAM_FACADE.paper.findViewByModel(cell)).el).addClass('active');
    			cell.set("routeName", this.altRoutes[this.currentRoutOnEdit].name);
        		cell.set("routeId", this.altRoutes[this.currentRoutOnEdit].id);
    		}else{
        		this.currentRoutElements.push(cell)
    		}
    	}
    },
    
    saveAltrRoute:function(name){
    	var Id = this.generateID() ;
    	
    	_.each( this.currentRoutElements , function(cell , i){
    		cell.set("routeName", name);
    		cell.set("routeId", Id);
    	});
    	this.altRoutes[Id] = {"name":name, id:Id, elements:this.currentRoutElements};
    	this.currentRoutElements = new Array();
    },

    addLive :function(currentCell){
    	 
    	
	   		_.each(DIAGRAM_FACADE.graph.getLinks(),function(link , i){
	   			
	       		 if (link.get("isAltRout") && currentCell.model.get('routeId') == link.get('routeId')){
	       			 V((DIAGRAM_FACADE.paper.findViewByModel(link)).el).addClass('live');
	       		 }
	   	 	});
	   		
	   		_.each(DIAGRAM_FACADE.graph.getElements(),function(element, i){
	   			
	       		 if (element.get("isAltRout") && currentCell.model.get('routeId') == element.get('routeId')){
	       			 V((DIAGRAM_FACADE.paper.findViewByModel(element)).el).addClass('live');
	       		 }
	   	 	});
	   		
	   	
	   	 
    },
    addRouteName:function(routeId){
    	 if(this.altRoutes[routeId]){
    		 $(this.altRouteNameDisplay).html(this.altRoutes[routeId].name);
    	    	$(this.altRouteNameDisplay).show();
    	    	
    	    	var smallesX = -1
    	    	var smallesY = -1
    	    	var biggestHeight = -1;
    	    	var routeWidth = 0;
    	    	
    	    	_.each (this.altRoutes[routeId].elements,function(cell,i){
    	    		
    	    		var cellBox = DIAGRAM_FACADE.paper.findViewByModel(cell).getBBox() ;
    	    		
    	    		if(cellBox.x < smallesX || smallesX == -1){
    	    			smallesX = cellBox.x;
    	    		}
    	    		
    	    		if(cellBox.height > biggestHeight || biggestHeight == -1){
    	    			biggestHeight = cellBox.height;
    	    		}
    	    		
    	    		if(cellBox.y < smallesY|| smallesY == -1){
    	    			smallesY = cellBox.y;
    	    		}
    	    		
    	    		routeWidth += cellBox.width;
    	    	});
    	    	 
    	    	$(this.altRouteNameDisplay).css('left', (((smallesX + routeWidth/2) + $('#canvas').offset().left) - ($(this.altRouteNameDisplay).width()+10))   +  'px');
    	    	$(this.altRouteNameDisplay).css('top', ((smallesY+5 + biggestHeight/2) + $('#canvas').offset().top)   +'px');
    	 }
    },
    
    removeRouteName:function(){
    	$(this.altRouteNameDisplay).hide();
    },
    
    removeLive :function(currentCell){
    	
	   
	   		_.each(DIAGRAM_FACADE.graph.getLinks(),function(link , i){
	   			
	   			if (link.get("isAltRout") && currentCell.model.get('routeId') == link.get('routeId')){
	       			 V((DIAGRAM_FACADE.paper.findViewByModel(link)).el).removeClass('live');
	       		 }
	   	 	});
	   		_.each(DIAGRAM_FACADE.graph.getElements(),function(element, i){
	   			
	   		 if (element.get("isAltRout") && currentCell.model.get('routeId') == element.get('routeId')){
					 V((DIAGRAM_FACADE.paper.findViewByModel(element)).el).removeClass('live');
				 }
			});
	   	 
    },
    showAltRoute:function(id){
    	if(id){
    		_.each(this.altRoutes[id].elements,function(cell,i){
   			 	V((DIAGRAM_FACADE.paper.findViewByModel(cell)).el).removeClass('hidden');
   			 	V((DIAGRAM_FACADE.paper.findViewByModel(cell)).el).addClass('live');
    		});
    		
    	}else{
    		
    		var cells = [];
    		
    		_.each(this.altRoutes,function(altRout,i){
    			cells = cells.concat(altRout.elements);
    		});
    		_.each(cells,function(cell,i){
    			 V((DIAGRAM_FACADE.paper.findViewByModel(cell)).el).removeClass('hidden');
    		});
    	}
    },
   
    
    hideAltRoute:function(id){
    	if(id){
    		_.each(this.altRoutes[id].elements,function(cell,i){
   			 	V((DIAGRAM_FACADE.paper.findViewByModel(cell)).el).addClass('hidden');
    		});
    		
    		
    	}else{
    		
    		var cells = []
    		
    		_.each(this.altRoutes,function(altRout,i){
    			cells = cells.concat(altRout.elements);
    		});
    		_.each(cells,function(cell,i){
    			 V((DIAGRAM_FACADE.paper.findViewByModel(cell)).el).addClass('hidden');
    		});
    		
    		 
    	}
    }
  
});
