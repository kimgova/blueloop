var SequenceItemView = Backbone.View.extend({
    
	template: '/blueloop-backend/static/js/loop/execution/sequence/main/template/SequenceItem.ejs',
    
	constructor : function (options) {
        _.extend(this, options);
    },
    
    render: function () {
        this.$el = $(new EJS({url: this.template }).render(this.model.attributes));
        
        if(this.index == 0){
            this.addClass();
        }

        this.setEvents();
        return this;
    },
    
    setEvents: function(){
    	this.$el.find(".content").click(this,this.showTabsContent);
    	this.$el.find("#removeSeq").click(this,this.removeSeq);
    	this.$el.find("#editSeq").click(this,this.editSeq);
    },
    
    showTabsContent: function(e) {  
    	if(SequenceExitModel.getInstance({}).get('skuPendingChanges') || SequenceExitModel.getInstance({}).get('cbbPendingChanges')){		  
    		bootbox.confirm(json.sequence.sequenceConfirm, function (r) {
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
				e.data.showContent(e);
			    SequenceExitModel.getInstance({}).set('skuPendingChanges',false);
				SequenceExitModel.getInstance({}).set('cbbPendingChanges',false);
			});
		}else{
			e.data.showContent(e);
		}
    },
    
    showContent: function(e){
    	var contentView = new SequenceTabView();
	    contentView.orderSeqId = e.data.model.get('id');
	    $("#seqColumn2").html(contentView.render().$el);
	    e.data.addClass();
    },

    removeSeq: function(e){
    	bootbox.confirm(json.general.deleteRow, function (r) {
			if(r){
		    	var seq = {id:e.data.model.id};
		    	var dataReturned = $.ajax({
			        type: 'POST',
			        url: '/blueloop-backend/orderSequence/deleteOrderSequence/',
			        data: JSON.stringify(seq),
			        contentType: 'application/json; charset=utf-8',
			        dataType: 'json',
			        async: false,
			        success: function(data, textStatus) {
			        	data =  data;
			        	e.data.remove();
			        	toastr.success(json.sequence.sequenceRemoved);
			        },
			    	error: function(httpRequest, textStatus, errorThrown) { 
			     	   console.log("status=" + textStatus + " ,error=" + errorThrown);
			     	   toastr.error(json.sequence.sequenceNotRemoved);
			     	}
			    });
		    	
		    	var sequencesLength = $('#seqList li').length;
		    	if(sequencesLength == 0){
		    		var contentView = new NoSequencesView({idLoop:e.data.idLoop});
		   			$("#seqColumn2").html(contentView.render().$el);
		    	}
		    }
		});
    },
    
    editSeq: function(e){
    	var editView = new SequenceEditItemView( { model: e.data.model } );
		e.data.$el.html(editView.render().$el);    	
    },
    
    addClass: function(e){
        this.$el.parent().find('li').removeClass('selected');
        this.$el.parent().find('li').addClass('list-primary');
        this.$el.parent().find('li').removeClass('list-danger');
        
        this.$el.addClass('selected');
        this.$el.removeClass('list-primary');
        this.$el.addClass('list-danger'); 
        
        $("#liSeqSkus").removeClass('active');
        $("#seqSkus").removeClass('active');
        
        $("#liSeqDefinition").addClass('active');
        $("#seqDefinition").addClass('active');
        
    }
    
});