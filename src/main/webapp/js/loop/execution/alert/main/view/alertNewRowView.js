var alertNewRowView = Backbone.View.extend({
	
	template: '/blueloop/static/js/loop/execution/alert/main/template/alertNewRowTemplate.ejs',
		
	constructor : function (options) {
		_.extend(this, options);
	},
	
	render: function () {
		this.$el = $(new EJS({url: this.template }).render());
		this.$el.find("#saveAlert").click(this,this.saveNewAlert);
		this.$el.find("#cancelAlert").click(this,this.cancelNewAlert);
		return this;
	},
	
	saveNewAlert: function(e){
		var alertTitle = e.data.$el.find("#titleAlert").val();
		var alertDescription = e.data.$el.find("#descriptionAlert").val();
		if(e.data.validate(alertTitle,alertDescription)){

			var dataAlert = new Object();
			dataAlert.name         = alertTitle;
		    dataAlert.description  = alertDescription;
		    dataAlert.idcbb        = e.data.idCBB;

	    	var result= $.ajax({
		        type: 'POST',
		        url: '/blueloop/chainBuildingBlockAlert/saveAlertByCBB/',
		        data: JSON.stringify(dataAlert),
		        contentType: 'application/json; charset=utf-8',
		        dataType: 'json',
		        async: false,
		        success: function(data, textStatus) {
		        	toastr.success(json.execution.alertSuccessSave);
		        	var model = new alertModel({
		        		id:data.cbbAlertBInstance.id,
		    			title: data.cbbAlertBInstance.name,
		    			description: data.cbbAlertBInstance.description,
		    			disabled:e.data.disabled
	                });
	                e.data.tableView.collection.push(model);
	                
	                var rowView = new alertRowView( { model: model, tableView:e.data.tableView, idCBB:e.data.idCBB} );
	                e.data.tableView.$el.find('#alert-table tbody').append(rowView.render().$el);
	                e.data.tableView.datatable.rows.add(rowView.render().$el).draw(); 
	                e.data.tableView.datatable.rows(e.data.$el).remove().draw();
	                e.data.remove();
		        },
		    	error: function(httpRequest, textStatus, errorThrown) { 
		     	   console.log("status=" + textStatus + " ,error=" + errorThrown);
		     	   toastr.error(json.bbalerts.errorSaving);
		     	}
			        
	    	});
	    
		}
	},
	
	validate: function(alertTitle,alertDescription){
		var valid = true;
		if(alertTitle.trim() == "" || /^\s*$/.test(alertTitle)){
			toastr.error(json.bbalerts.errorEmptyTitle);
			valid = false;
		}
		if(alertDescription.trim() == "" || /^\s*$/.test(alertDescription)){
			toastr.error(json.bbalerts.errorEmptyDescription);
			valid = false;
		}
		return valid;
	},
	
	cancelNewAlert: function(e) {
		e.data.tableView.datatable.rows(e.data.$el).remove().draw();
		e.data.remove();
	}
});