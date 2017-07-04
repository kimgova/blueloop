var  DiagramClipboardTool =  Backbone.Model.extend({
        
        initialize :function(){
    
        this.selection = new Array();
            this.addEvents();
        },
        
        copy:function(){
            this.selection=DIAGRAM_FACADE.selectionView.model.models;
        },
        
        paste:function(){
            _.each(this.selection,function(cell,i){
                DIAGRAM_FACADE.graph.addCell(cell.clone());
            });
        },
        
        cut:function(){
            this.selection=DIAGRAM_FACADE.selectionView.model.models;
            _.each(this.selection,function(cell,i){ 
                cell.remove();
                DIAGRAM_FACADE.selectionView.clearSelection();
            });
        },
        
        "delete":function(){
            this.selection=DIAGRAM_FACADE.selectionView.model.models;
            _.each(this.selection,function(cell,i){ 
                cell.remove();
                chain.deleteBuildingBlock(cell.id);
            });
            this.selection=[];
            DIAGRAM_FACADE.selectionView.clearSelection();
            
        },
        addEvents:function(){
            var that = this;
             $(document).on("copy",function(e){
                 that.copy();
             });
             
             $(document).on("paste",function(e){
                 that.paste();
             });
             
             $(document).on("cut",function(e){
                 that.cut();
             });
             
             $(document).on('click','#btnDelete',function(e){
                 that["delete"]();
             });
             
            $(document).keyup(function(e){
                switch (e.keyCode ){
                    case 46:
                        that["delete"]();
                        break;
                    case 90: //z
                     
                        break;
                    case 89: //Y
                     
                        break;
                }
            });
        }
});