var SequenceNewItemView = Backbone.View.extend({
    
	template: '/blueloop/static/js/loop/execution/sequence/main/template/SequenceNewItem.ejs',
        
    constructor : function (options) {
		_.extend(this, options);
	},
    
    render: function () {
    	this.$el = $(new EJS({url: this.template }).render());
        this.$el.find("#saveSeq").click(this,this.saveNewSeq);
        this.$el.find("#cancelSeq").click(this,this.cancelNewSeq);               
    	
        return this;
    },
 
    saveNewSeq: function(e){
    	var nameSeq = e.data.$el.find('#nameSeq').val()
    	if(e.data.validate(nameSeq)){
    		var newseq = JSON.parse(e.data.saveSeq(nameSeq, e.data.idLoop));
        	var model = new SequenceModel({
        		id:		   	 newseq.id,
          	    description: newseq.description,    	
          	});
        	var itemView = new SequenceItemView( { model: model } );
     		$('#seqList').append(itemView.render().$el);
        	e.data.remove();
        	
        	var sequencesLength = $('#seqList li').length;
	    	if(sequencesLength == 1){ //is the first created sequence
	    		var contentView = new SequenceTabView();
	    		contentView.orderSeqId = newseq.id;
	            $("#seqColumn2").html(contentView.render().$el);
	            $("#addSeqBtn").removeAttr('disabled');
	            
	            itemView.addClass();
	    	}
    	}		
    },
    
    saveSeq: function(nameSeq, idLoop){
    	var dataSeq = {nameSeq:nameSeq,idLoop:idLoop}; 
    	var dataReturned = $.ajax({
	        type: 'POST',
	        url: '/blueloop/orderSequence/saveOrderSequence/',
	        data: JSON.stringify(dataSeq),
	        contentType: 'application/json; charset=utf-8',
	        dataType: 'json',
	        async: false,
	        success: function(data, textStatus) {
	        	data =  data;
	        	toastr.success(json.sequence.sequenceAdded);
	        },
	    	error: function(httpRequest, textStatus, errorThrown) { 
	     	   console.log("status=" + textStatus + " ,error=" + errorThrown);
	     	   toastr.error(httpRequest.responseJSON.error);
	     	}
	    });
    	return dataReturned.responseText;
    },
    
    validate: function(nameSeq){
		var valid = true;
		if(nameSeq.trim() == "" || /^\s*$/.test(nameSeq)){
			toastr.error(json.sequence.errorEmptySeq);
			valid = false;
		}
		return valid;
	},
	
    cancelNewSeq: function(e) {
    	e.data.remove();
    }

});