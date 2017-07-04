var SequenceModalView = Backbone.View.extend({

	template: '/blueloop/static/js/loop/execution/sequence/main/template/SequenceModal.ejs',

	constructor : function (options) {
		_.extend(this, options);
	},

	render: function() {
		SequenceExitModel.getInstance({clean:true})
		
		this.$el = $(new EJS({url: this.template }).render());
		this.collection = new SequenceCollection([]);
		var type = this.defineContent();

		this.setColum1Content();
		this.setColum2Content(type);
		
		this.setEvents();
		return this;
	},
	
	setEvents: function(){
		this.$el.find("#closeHeader").click(this,this.closeModal);
		this.$el.find("#closeBtn").click(this,this.closeModal);
		this.$el.find("#addSeqBtn").click(this,this.addSeqBtn);		
	},
	
	setColum1Content: function(){
		this.collection.each(this.addItem, this);
	},
	
    addItem: function(model,index) {
        var itemView = new SequenceItemView( { model: model, index:index } );
        this.$el.find('#seqList').append(itemView.render().$el);
    },
    
	setColum2Content: function(type){
		switch (type){
   		case "noSkusAndNoArquitec":
   			var contentView = new NoSkusView({isArquitect:false});
   			this.$el.find("#seqColumn2").append(contentView.render().$el);
   			this.$el.find("#addSeqBtn").attr('disabled','');   			
			break;
   		case "noSkusAndArquitec":
   			var contentView = new NoSkusView({isArquitect:true, idLoop:this.idLoop});
   			this.$el.find("#seqColumn2").append(contentView.render().$el);
   			this.$el.find("#addSeqBtn").attr('disabled','');
			break;
   		case "noSequences":
   			var contentView = new NoSequencesView({idLoop:this.idLoop});
   			this.$el.find("#seqColumn2").append(contentView.render().$el);
   			this.$el.find("#addSeqBtn").removeAttr('disabled');
			break;
   		case "sequences":
            var contentView = new SequenceTabView();
            contentView.orderSeqId = this.collection.first().get("id");
            this.$el.find("#seqColumn2").html(contentView.render().$el);
            this.$el.find("#addSeqBtn").removeAttr('disabled');
            break;
        }
	},
	
	defineContent: function(){
		var typeContent = ''
		var jsonObject = {id:this.idLoop}
		var result = ajaxCall('GET', '/blueloop/orderSequence/getSequencesByChain/', jsonObject, "text/json", "json", false);		
		this.setCollection(result.sequences);		
		if(result.hasSkus){
			if(result.hasSequences){		
				typeContent = "sequences";
			}else{
				typeContent = "noSequences";
			}			
		}else{
			if(result.isArchitec){		
				typeContent = "noSkusAndArquitec";
			}else{
				typeContent = "noSkusAndNoArquitec";
			}
		}		
		return typeContent
	},
	
	setCollection: function(dataSequences){
		_.each(dataSequences,function(item,i){
    		var sequence = new SequenceModel({
    			id:item.id,
    		  	description: item.description
    		});
    		this.collection.add(sequence); 
	    },this); 
	},
	
	closeModal: function(e){	
		if(SequenceExitModel.getInstance({}).get('skuPendingChanges') || SequenceExitModel.getInstance({}).get('cbbPendingChanges')){
			bootbox.confirm({
				title: 'Confirm',
				message: json.sequence.sequenceConfirm,
				buttons: {
					'cancel': {
						label: json.button.no,
						className: 'btn btn-white'
					},
					'confirm': {
						label: json.button.yes,
						className: 'btn btn-white'
					}
				},
				callback: function(r){
					if(r){
						if(SequenceExitModel.getInstance({}).get('skuPendingChanges')){
							var tabSkus = SequenceExitModel.getInstance({}).get('skuTabView'); 
							tabSkus.save(tabSkus.sequenceId,tabSkus.listSkusToSave)
						}
						if(SequenceExitModel.getInstance({}).get('cbbPendingChanges')){
							var tabCbbs = SequenceExitModel.getInstance({}).get('cbbTabView'); 
							tabCbbs.save(tabCbbs.orderSeqId,tabCbbs.sequenceCollection)
						}
					}
					e.data.$el.modal("hide");
					SequenceExitModel.getInstance({}).set('skuPendingChanges',false);
					SequenceExitModel.getInstance({}).set('cbbPendingChanges',false);
				}
			});
		}else{
			e.data.$el.modal("hide");
		}		
	},
	
	addSeqBtn: function(e){
		var newItemView = new SequenceNewItemView({idLoop:e.data.idLoop});
    	e.data.$el.find('#seqList').append(newItemView.render().$el);
	}
});