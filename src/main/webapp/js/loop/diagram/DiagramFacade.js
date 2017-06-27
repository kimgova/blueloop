var DiagramFacade = Backbone.Model.extend({
    constructor: function(options) {
        _.extend(this, options); 
        this.dropLocation = new Object();
        this.graph = new joint.dia.Graph;
        this.scale=1;
        
      },
   
    createDiagram : function (container){
        this.paper = new joint.dia.Paper({
            el: $(container),
            width: "100%",
            height: "90%",
            gridSize: 20,
            model: this.graph,
            linkView: DIAGRAM_LINK_VIEW,
            elementView:DIAGRAM_ELEMENT_VIEW
        });
        this.altRoutController = new AlternativeRouteController({ paper: this.paper, graph: this.graph});
        this.addEvents();
    },
    
    setClipboardTools:function(){
        this.clipboard = new DiagramClipboardTool({ paper: this.paper, graph: this.graph});
    },
    setExecutionLayer:function(excMode){
        this.executionLayer = excMode;
    },
    setSelectionTool:function(){
          this.selectionView = new DiagramSelectionTool({ paper: this.paper, graph: this.graph, model: new Backbone.Collection,el:$("<div class='section'></div>")});
          this.selectionView.render();
    },
    
    initCell:function(cell){
        var that = this;
        if(cell instanceof joint.dia.Link){
            cell.set('router', { name: 'manhattan' });
            cell.label(0,{
                position: 0.4
            });
            cell.attr({
                '.marker-source': { fill: '#000',  },
                '.marker-target': { fill: '#000', d: 'M 10 0 L 0 5 L 10 10 z' }
            });
            
            if(this.altRoutController.altRoutinMode){
                cell.attr({
                    '.connection': {stroke: '#3498DB', 'stroke-width': 3, 'stroke-dasharray': '5 2' },
                    '.marker-source': { fill: '#3498DB'  },
                    '.marker-target': { fill: '#3498DB', d: 'M 10 0 L 0 5 L 10 10 z' }
                });
                
            }

            cell.on('change:target', function(evt) {
                if(evt.attributes.target.id != undefined ){
                    var sourceId = that.graph.getCell(cell.get('source').id).get("formId");
                    var targetId = that.graph.getCell(cell.get('target').id).get("formId");
                    $(document).find("#modalValve").remove();
                    var modalView = new valveModalView({valveId:cell.id,sourceBBId:sourceId.substr(3),targetBBId:targetId.substr(3)});
                    modalView.render().$el.modal("show");
                } 
            })
        } 
    },
    
    addStepToModel:function(step,modelId){
        var cell = this.graph.getCell(modelId);
        if(cell){
            cell.set("step",step);
        }
    },
    
    addEvents:function(){
        this.paper.on('cell:pointerdblclick',function(cellView,evt){
            var cellModel = cellView.model;

            if(cellModel instanceof joint.dia.Link){
                var leftId = this.graph.getCell(cellModel.get('source').id).get("formId");
                var rightId = this.graph.getCell(cellModel.get('target').id).get("formId");
                
                if(!this.isExecutionMode){
                    $(document).find("#modalValve").remove();
                    var modalView = new valveModalView({valveId:cellModel.id,sourceBBId:leftId.substr(3),targetBBId:rightId.substr(3)});
                    modalView.render().$el.modal("show");
                }else{
                    FormController.openValveEForm(cellModel.id,this.graph.getCell(cellModel.get('source').id).get("id"),this.graph.getCell(cellModel.get('target').id).get("id"));
                }
                
            }else{
                
                if(this.isExecutionMode){
                    FormController.openForm(cellModel.id,false,cellModel.id);
                }else{
                    FormController.openForm(cellModel.get("formId"),false,cellModel.id);
                }
            }
        },this);
 
        this.graph.on('add', function(cell){ 
            
            this.altRoutController.onCellAdded(cell)
            this.initCell(cell);
            
        },this);
    },
    
    createBuildingBlock:function (imgUrl, point, bbText,formId,type,alias){
        var bbName = bbText;
        if(alias != 1){
            bbName = bbText + " (" + alias + ")";
        }
        var bb = new joint.shapes.basic.DecoratedRect({
            position: { x: point.x, y: point.y },
            size: { width: 96, height: 96},
            formId:formId,
            alias:alias,
            attrs:{
                text:{text:bbName}, 
                "image":{ 'xlink:href': imgUrl, width: 48, height: 48 , x:"24" , y : "24" }
            } 
        });
        
        bb.on('change:position', this.updatePaper,this);
        var graph = this.graph.addCell(bb);
        var modelId = _.last(graph.get('cells').models).id;
        
        return modelId;
    },
   
    updatePaper:function(e){
        this.paper.fitToContent(this.paper.$el.width()-15, this.paper.$el.height()-15)
    },
    
    zoomIn : function(){
        this.scale = this.scale + 0.5;
        this.paper.scale(this.scale,this.scale);
        this.selectionView.updateSelectionBoxes();
        that.updatePaper()
    },
    
    zoomOut : function(){
        this.scale = this.scale - 0.5;
        this.paper.scale(this.scale,this.scale);
        this.selectionView.updateSelectionBoxes();
        that.updatePaper()
    },
    
    save:function(){
        var json =JSON.stringify(this.graph.toJSON());
        localStorage.setItem("data",json);
        return json;
    },
    
    generateImage:function(){
         
        $("#canvas").append($("<canvas id='svgcanvas' style='display:none' ></canvas>"));
        var svg = $("svg").clone(); 
        $(svg).attr("xmlns:xlink","http://www.w3.org/1999/xlink");
        $(svg).attr("width",$("svg").width());
        $(svg).attr("height",$("svg").height());
        $(svg).find(".marker-arrowhead").remove();
        $(svg).find(".link-tools").remove();
        $(svg).find("rect").remove();
        $(svg).find(".labels").remove();
        $(svg).find(".marker-vertex-group").remove();
         
        var SVGxml  = new XMLSerializer().serializeToString($(svg)[0]);
 
        return SVGxml;
    },
    
    loadDiagram:function(json,haveOrders){
        this.graph.fromJSON(JSON.parse(json));
        this.altRoutController.fetchPrevAltRouts();
        this.haveOrders = haveOrders;
        if(this.isExecutionMode){
            this.initExcMode();
        }
        if(this.haveOrders){
            this.setNonInteractiveElements(); 
        }
    },
    
    initExcMode:function(){
        this.altRoutController.hideAltRoute();
        if(this.executionLayer == EXECUTION_MODES.RESILIENCE){
            this.loadRiskAlerts();
        }else{
            this.loadGeneralAlerts();
            this.loadOrderAlerts();
        } 
        this.paper.interactive = false;
    },
    loadRiskAlerts:function(){
        _.each(this.graph.getElements(),function(cell,i){
            var cellview = DIAGRAM_FACADE.paper.findViewByModel(cell).$el;
            riskPopoverController.createRiskPopoverContainer(cell.id, cellview);
        });
    },
    loadGeneralAlerts:function(){
        _.each(this.graph.getElements(),function(cell,i){
            var cellview = DIAGRAM_FACADE.paper.findViewByModel(cell).$el;
            alertPopoverController.createAlertPopoverContainer(cell.id, cellview);
        });    
    },
    loadOrderAlerts:function(){       
        _.each(this.graph.getElements(),function(cell,i){
            var cellview = DIAGRAM_FACADE.paper.findViewByModel(cell).$el;
            orderPopoverController.createOrderPopoverContainer(cell.id, cellview);
        });    
    },
    isFlowBBContainerShowing:false,

    showFlowBBContainer:function(){
        this.isFlowBBContainerShowing = true;
        chain.valveDropTemplate.modal("show");
    },
    hideFlowBBContainer:function(){
        this.isFlowBBContainerShowing = false;
        chain.valveDropTemplate.modal("hide");
    },
    showConnected:function(ids){
        _.each(this.graph.getElements(),function(element, i){
             if ($.inArray(element.get("formId"), ids ) > -1){
                 V((DIAGRAM_FACADE.paper.findViewByModel(element)).el).addClass('connected');
             }
        });
    },
    
     hideConnected:function(){
        _.each(this.graph.getElements(),function(element, i){ 
                 V((DIAGRAM_FACADE.paper.findViewByModel(element)).el).removeClass('connected');
        });
    },
    
    getAvailableCBB:function(idForm){
        var idFormList = [];
        _.each(this.graph.getConnectedLinks(this.graph.getCell(idForm), []),function(cell, i){ 
            idFormList.push(cell.get('target').id);
        });    
        
        return idFormList;
    },
    
    setNonInteractiveElements : function(){
        _.each(this.graph.getLinks(),function(item, i){ 
            this.paper.findViewByModel(item).options.interactive = false
            this.paper.findViewByModel(item).$el.find(".marker-arrowhead").remove();
            this.paper.findViewByModel(item).$el.find(".tool-remove").remove();
            this.paper.findViewByModel(item).$el.find(".marker-vertex-group").remove();
            this.paper.findViewByModel(item).$el.find(".connection-wrap").css('cursor', 'default');
            this.paper.findViewByModel(item).$el.find(".label").css('cursor', 'pointer');
        },this);
        
        _.each(this.graph.getElements(),function(item, i){ 
            this.paper.findViewByModel(item).options.nonInteractive = true
        },this);
    }
  
});