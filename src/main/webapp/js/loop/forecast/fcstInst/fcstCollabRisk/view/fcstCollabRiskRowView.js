var fcstCollabRiskRowView = Backbone.View.extend({
    
    template: '/blueloop/static/js/loop/forecast/fcstInst/fcstCollabRisk/template/fcstCollabRiskRow.ejs',
        
    render: function () {
        this.$el = $(new EJS({url: this.template }).render(this.model.toJSON()));
        this.$el.find("#editRisk").click(this,this.editRisk);
        this.$el.find("#checkRisk").click(this,this.checkRisk);
        this.$el.find("#deleteRisk").click(this,this.deleteRisk);        
        return this;
    },

    deleteRisk: function(e) {
    	bootbox.confirm(json.general.deleteRow, function (r) {
			if(r){	
		    	var riskData = {id:e.data.model.id};
		    	var dataReturned = $.ajax({
			        type: 'POST',
			        url: '/blueloop/fcstCollaborative/deleteCollabRisk/',
			        data: JSON.stringify(riskData),
			        contentType: 'application/json; charset=utf-8',
			        dataType: 'json',
			        async: false,
			        success: function(data, textStatus) {
			        	data =  data;
			        	e.data.remove();
			        },
			    	error: function(httpRequest, textStatus, errorThrown) { 
			     	   console.log("status=" + textStatus + " ,error=" + errorThrown);
			     	   toastr.error(json.error.tryAgain);
			     	}
			    });
			}
		});
	},
	
	checkRisk: function(e) {
		bootbox.confirm(json.general.applyRow, function (r) {
			if(r){	
				var riskData = {id:e.data.model.id};
		    	var dataReturned = $.ajax({
			        type: 'POST',
			        url: '/blueloop/fcstCollaborative/changeCollabRiskToAdj/',
			        data: JSON.stringify(riskData),
			        contentType: 'application/json; charset=utf-8',
			        dataType: 'json',
			        async: false,
			        success: function(data, textStatus) {
			        	data =  data;
				    	$('#fcst-collab-risk-modal #riskContent').empty()
				    	var tableView = new fcstCollabRiskTableView({ model: e.data.model.get("tableModel")});
				    	$('#fcst-collab-risk-modal #riskContent').append(tableView.render().$el);
			        },
			    	error: function(httpRequest, textStatus, errorThrown) { 
			     	   console.log("status=" + textStatus + " ,error=" + errorThrown);
			     	   toastr.error(json.error.tryAgain);
			     	}
			    });
			}
		});
	},
	
	editRisk: function(e) {
		var modelView = new fcstCollabRiskEditRowView( { model: e.data.model } );
		e.data.$el.empty();
		e.data.$el.append(modelView.render().$el);
	}

});