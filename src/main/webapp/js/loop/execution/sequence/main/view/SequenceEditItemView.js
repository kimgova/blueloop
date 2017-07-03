var SequenceEditItemView = Backbone.View.extend({
    
	template: '/blueloop/static/js/loop/execution/sequence/main/template/SequenceEditItem.ejs',
        
    render: function () {
        this.$el = $(new EJS({url: this.template }).render(this.model.toJSON()));
        this.$el.find("#saveSeq").click(this,this.saveEditSeq);
        this.$el.find("#cancelSeq").click(this,this.cancelEditSeq);
        return this;
    },
    
    saveEditSeq: function(e){
    	var newname = e.data.$el.find("#nameSeq").val(); 
    	if(e.data.validate(newname)){    	   	
	    	var dataseq = JSON.parse(e.data.editSeq(e.data.model, newname));
	    	e.data.model.set("description", newname);
	    	var itemView = new SequenceItemView( { model: e.data.model } );
	    	e.data.$el.parent().after(itemView.render().$el);
	    	e.data.remove();
    	}
    },
    
    editSeq: function(model,newname){
    	var seq = {id:model.id,name:newname};
    	var dataReturned = $.ajax({
	        type: 'POST',
	        url: '/blueloop/orderSequence/editOrderSequence/',
	        data: JSON.stringify(seq),
	        contentType: 'application/json; charset=utf-8',
	        dataType: 'json',
	        async: false,
	        success: function(data, textStatus) {
	        	data =  data;
	        	toastr.success(json.sequence.sequenceEdited);
	        },
	    	error: function(httpRequest, textStatus, errorThrown) { 
	     	   console.log("status=" + textStatus + " ,error=" + errorThrown);
	     	   toastr.error(httpRequest.responseJSON.error);
	     	}
	    });
    	return dataReturned.responseText;
    },
    
    validate: function(seqName){
		var valid = true;
		if(seqName.trim() == "" || /^\s*$/.test(seqName)){
			toastr.error(json.sequence.errorEmptySeq);
			valid = false;
		}
		return valid;
	},
    
    cancelEditSeq: function(e) {
    	var itemView = new SequenceItemView( { model: e.data.model } );
    	e.data.$el.parent().after(itemView.render().$el);
    	e.data.remove();
    }

});