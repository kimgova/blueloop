var fcstCollabAdjRowView = Backbone.View.extend({
    
    template: '/blueloop/static/js/loop/forecast/fcstInst/fcstCollabAdj/template/fcstCollabAdjRow.ejs',
        
    render: function () {
        this.$el = $(new EJS({url: this.template }).render(this.model.attributes));
        this.$el.find("#editCollabAdjustment").click(this,this.editRow);
        this.$el.find("#deleteCollabAdjustment").click(this,this.deleteRow);
        return this;
    },
    
    editRow: function(e) {
		var modelView = new fcstCollabAdjEditRowView( { model: e.data.model } );
		e.data.$el.empty();
		e.data.$el.append(modelView.render().$el);
	},
	
	deleteRow: function(e){
		bootbox.confirm(json.general.deleteRow, function (r) {
			if(r){				
				var adjData = {id:e.data.model.id};
		    	var dataReturned = $.ajax({
			        type: 'POST',
			        url: '/blueloop/fcstCollaborative/deleteCollaborativeAdjustment/',
			        data: JSON.stringify(adjData),
			        contentType: 'application/json; charset=utf-8',
			        dataType: 'json',
			        async: false,
			        success: function(data, textStatus) {
			        	data =  data;
			        	e.data.remove();	
			        },
			    	error: function(httpRequest, textStatus, errorThrown) { 
			     	   console.log("status=" + textStatus + " ,error=" + errorThrown);
			     	   toastr.error("This adjustment can not be deleted, it has associated data");
			     	}
			    });
		    }
		});
	}

});