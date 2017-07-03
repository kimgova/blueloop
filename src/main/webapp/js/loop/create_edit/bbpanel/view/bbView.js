var bbView = Backbone.View.extend({
	
	 template: '/blueloop/static/js/loop/create_edit/bbpanel/template/bbTemplate.ejs',
	 
	 constructor : function (options) {
		 _.extend(this, options);
		 this.listenTo(this.model, 'show', this.show);
	        this.listenTo(this.model, 'hide', this.hide);
	 },
	  
	 render: function() {
		 this.$el = $(new EJS({url: this.template }).render(this.model.toJSON()));
		 this.setForm();
		 this.setDraggable();
		 this.setEvents();
		 return this;
	  },
	  
	  hide: function(){
		  this.$el.hide();
	  },
	    
	  show: function(){
		  this.$el.show();
	  },
	  
	  setForm: function(){
		  if(this.model.get("type") != "new"){
			  if(FormController.formPool["cb_" + this.model.id] == undefined){
				  FormController.createForm("cb_" + this.model.id, this.model.get("type"), false,false,false,{},0,this.model.get("config"));
			  }
		  }else{
			  FormController.createForm("bbt_" + this.model.id, this.model.get("name"), true,false,true,{},0); 
		  }
	  },
	  
	  setDraggable: function(){
		  var that = this;
		  this.$el.draggable({ 
			  cursorAt: { left: -4 },
			  helper: 'clone',
			  start:function(event, ui){        		
				  chain.currentFlowBB=that;        		 
			  },

			  stop:function(event, ui) {
				  if (that.model.get("type") == "new" ){
					  $(ui.helper).remove();
				  }
				  that.dropFigure(event,ui);
			  }
		  });
	  },
	  
	  dropFigure: function(event,ui){
		  if ( this.model.get("panelType") == "new" ){
			  FormController.openForm(this.model.get("idForm"),true,undefined,
					  g.snapToGrid((event.pageX - $("#canvas").offset().left),window.DIAGRAM_FACADE.paper.options.gridSize),
					  g.snapToGrid((event.pageY - $("#canvas").offset().top),window.DIAGRAM_FACADE.paper.options.gridSize),this.model.get("config"));
		  }else{
			  if(this.model.get("category") == "Stock"){
				  var px = g.snapToGrid((event.pageX - $("#canvas").offset().left),window.DIAGRAM_FACADE.paper.options.gridSize) ;
				  var py = g.snapToGrid((event.pageY - $("#canvas").offset().top),window.DIAGRAM_FACADE.paper.options.gridSize) ;
				  FormController.openResponsibleForm(this.model.get("idForm"),px,py,this);
			  }else{
				  if(chain.currentValve != ""){
					  FormController.openResponsibleForm(this.model.get("idForm"),0,0,this);
				  }
				  chain.currentFlowBB="undefined";
			  }
		  }
		  this.panelView.renderBBList();
	  },
	    
	  finalizeStockDrop: function(idForm,px,py,idResponsible,leadTime,leadTimeType){
		  var aliasCont = 1;
		  _.each(chain.chainBbPool,function(item,i){
			  if(item.idBB == this.model.id){
				  aliasCont = item.alias + 1;
			  }
		  },this);

		  FormController.createForm(idForm,this.model.get("type"),true,false,false,{},0,this.model.get("config"),idResponsible,leadTime,leadTimeType);
		  var modelId = window.DIAGRAM_FACADE.createBuildingBlock(this.model.get("filePath")+this.model.get("fileName"),{x:px,y:py}, this.model.get("name"),idForm,this.model.get("type"),aliasCont);
		  chain.chainBbPool[modelId] = {modelId:modelId,type:this.model.get("type"),responsible:idResponsible,leadTime:leadTime,leadTimeType:leadTimeType,idBB:this.model.id,alias:aliasCont};    
	  },
	  
	  setEvents: function(){
		  var that = this;
		  this.$el.dblclick(function(){
	    		if (that.model.get("panelType") != "new" ){
	   		 		FormController.openForm("cb_" + that.model.id);
	    		}else{
	    			FormController.openForm("bbt_" + that.model.id);
	    		}
		  });
	  }
	 
});