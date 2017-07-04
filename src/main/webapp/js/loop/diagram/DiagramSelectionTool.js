var DiagramSelectionTool =  Backbone.View.extend({
    initialize : function(options) {
        _.extend(this, options);
        this.selectionBoxes = new Array();
 
        this.paper.on('blank:pointerdown', function(e,x,y){
              this.onBlankPointerDown(e,x,y);
         },this);
        
         this.paper.on('cell:pointerclick',function(cellView,evt){
              if (!(cellView.model instanceof joint.dia.Link)) {
                  
                    if (!(evt.shiftKey || evt.metaKey)) {
                        this.destroySelectionBoxes();
                    }
                
                var select = this.createSelectionBox(cellView);
                if(select){
                    this.model.add(cellView.model);
                }
              }
          },this);
 
         $("#canvas").scroll(this,this.updateSelectionBoxes);
    },
    
    onBlankPointerDown:function(e,x,y){
        switch ($(e.target).prop("tagName").toLowerCase()){
            case "svg": 
                this.startSelecting(e,x,y);
                break;
            case "div" :
                this.startMovingElements(e);
                break;
        }
    },
    
    events:{
      'click' :   "onCellClick"
    },
    
    onCellClick:function(evt){
       if (evt.shiftKey || evt.metaKey) {
           var model = $(evt.target).data('model');
           
            var cell = this.model.get(model);
           
             this.destroySelectionBox(cell);
             this.model.reset(this.model.without(cell));   
       }
    },
    
    startMovingElements : function(e,x,y){
        var click_y = e.pageY;
        var click_x = e.pageX;
        
        var that = this;
        
        var prevLocationX = 0;
        var prevLocationY = 0;
        
        this.paper.$el.on('mousemove.selection', function(e) {
            var move_x = e.pageX;
            var move_y = e.pageY;
            var grid   = that.paper.options.gridSize;
            var movementX = g.snapToGrid((move_x - click_x),grid);
            var movementY = g.snapToGrid((move_y - click_y),grid);
          
            if (movementX != prevLocationX){
                var directionX = 1;
                if(movementX < prevLocationX){
                    directionX = -1;
                }
               
                 _.each(that.model.models,function(item,i){
                    item.translate(grid * directionX);  
                   that.updateSelectionBox(item);
                });
            }
            prevLocationX = movementX;
           
            if (movementY != prevLocationY){
                var directionY = 1;
                if(movementY < prevLocationY){
                    directionY = -1;
                }
                _.each(that.model.models,function(item,i){
                    item.translate(0,grid * directionY);    
                    that.updateSelectionBox(item);
                });
            }
            prevLocationY = movementY;
            
                
        }).on('mouseup.selection', function(e) {
            that.paper.$el.off('mousemove.selection');
            that.paper.$el.off('mouseup.selection');
        });
    },
    
    clearSelection:function(){
        this.model.reset();
        this.destroySelectionBoxes();
    },
    
    startSelecting : function(e,x,y){
        var paper = this.paper;
      
        this.clearSelection();
        var grid = this.paper.options.gridSize;
        
        var $container = this.paper.$el;
        var $selection = $("<div class='current-box'></div>");
 

        var click_y = e.pageY;
        var click_x = e.pageX;
        var width,height;
        var move_x ,move_y, new_x, new_y;
        var that = this;
        
        $container.on('mousemove.selection', function(e) {
            $selection.show();
            $selection.css({
              'top':    click_y,
              'left':   click_x,
              'width':  0,
              'height': 0
            });
            
            $selection.appendTo($container);
            
            move_x = e.pageX;
            move_y = e.pageY;
            
            
            width  = Math.abs(move_x - click_x);
            height = Math.abs(move_y - click_y);

            new_x = (move_x < click_x) ? (click_x - width) : click_x;
            new_y = (move_y < click_y) ? (click_y - height) : click_y;

            $selection.css({
              'width': width,
              'height': height,
              'top': new_y,
              'left': new_x
            });
            
        }).on('mouseup.selection', function(e) {
            
            $selection.remove();
            $container.off('mousemove.selection');
            $container.off('mouseup.selection');
            
            var rect ;
      
            new_x = g.snapToGrid(new_x,grid) - g.snapToGrid($container.offset().left,grid)
            new_y = g.snapToGrid(new_y,grid) - g.snapToGrid($container.offset().top,grid)
            
            if(new_x || new_y ){
                if( x > new_x || y > new_y ){
                    rect = g.rect(new_x,new_y,width,height);
                }else{
                   rect = g.rect(x,y,width,height);
                }
                
                var selectedViews=that.paper.findViewsInArea(rect);
                that.createSelectionBoxes(selectedViews);
            }
        });
   
    },
    
    createSelectionBoxes : function(cellViews){
        var msg = false
        _.each(cellViews,function(cellView,i){
            if(!cellView.options.nonInteractive){
                this.createSelectionBox(cellView);
                this.model.add(cellView.model);
            }else{
                DIAGRAM_FACADE.selectionView.clearSelection();
                msg = true
            }
        },this);
        if(msg){
            toastr.error('This sequence have active orders, cannot be selected or deleted');
        }
    },
    
    createSelectionBox : function(cellView){
        if(!cellView.options.nonInteractive){
            var $selectionBox = $("<div class='selection-box' data-model="+cellView.model.id+"></div>");
            var bbox = cellView.getBBox();
            var grid = this.paper.options.gridSize;
            
            
            this.$el.append($selectionBox);
           
            $selectionBox.css({
                  'width': bbox.width + 5,
                  'height': bbox.height+ 5,
                  'top': this.paper.$el.offset().top+(bbox.y),
                  'left': this.paper.$el.offset().left+(bbox.x)
            });
            var paper = this.paper
            $selectionBox.dblclick(function(e){paper.trigger('cell:pointerdblclick',cellView,e)});
            return true
        }else{
            DIAGRAM_FACADE.selectionView.clearSelection();
            toastr.error('This sequence have active orders, cannot be selected or deleted');
            return false
        }
    },
    
    updateSelectionBoxes:function(e){
        if(e){
//            _.each(e.data.model.models,function(model,i){ 
//                  
//                e.data.updateSelectionBox(model);
//            });
        }else{
            _.each(this.model.models,function(model,i){ 
                this.updateSelectionBox(model);
            },this);
            
        }
        
    },
    
    updateSelectionBox:function(model){
        var $selectionBox = $("[data-model="+model.id+"]");
        var bbox = this.paper.findViewByModel(model).getBBox();
        var grid = this.paper.options.gridSize;
        
        $selectionBox.css({
            'width': bbox.width + 5,
            'height': bbox.height+ 5,
            'top': this.paper.$el.offset().top+(bbox.y),
            'left': this.paper.$el.offset().left+(bbox.x)
      });
        
    },
    
    destroySelectionBoxes : function(){
        this.$el.find(".selection-box").remove();
        
    },
    
    destroySelectionBox : function(model){
        var $selectionBox = $("[data-model="+model.id+"]");
        $selectionBox.remove();
        
    },
    
    render:function(){
        this.paper.$el.append(this.$el);
        return this;
    }
});