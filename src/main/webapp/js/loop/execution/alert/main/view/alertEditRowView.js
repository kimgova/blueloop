var alertEditRowView = Backbone.View.extend({
    
    template: '/blueloop-backend/static/js/loop/execution/alert/main/template/alertEditRowTemplate.ejs',
        
    constructor : function (options) {
        _.extend(this, options);
    },
    
    render: function () {
        this.$el = $(new EJS({url: this.template }).render(this.model.toJSON()));
        this.setEvents();
        return this;
    },
    
    setEvents: function(){
        this.$el.find("#saveEditAlert").click(this,this.saveEditAlert);
        this.$el.find("#cancelEditAlert").click(this,this.cancelEditAlert);
    },
    
    saveEditAlert: function(e){
        if(e.data.validate(e.data.$el.find("#titleAlert").val(),e.data.$el.find("#descriptionAlert").val())){
            e.data.saveAlert(e.data);
        }
    },
    
    cancelEditAlert: function(e) {
        e.data.tableView.datatable.rows(e.data.$el).remove();
        e.data.remove();
        
        var rowView = new alertRowView( { model: e.data.model, tableView:e.data.tableView, idCBB:e.data.idCBB } );
        e.data.tableView.datatable.rows.add(rowView.render().$el).draw(); 
    },
    
    validate: function(title,description){
        var regexBlank  = /^\s*$/;
        var valid = true;

        if(title.trim() == "" || regexBlank.test(title)){
            toastr.error(json.bbalerts.errorEmptyTitle);
            valid = false;
        }

        if(description.trim() == "" || regexBlank.test(description)){
            toastr.error(json.bbalerts.errorEmptyDescription);
            valid = false;
        }
        
        return valid;
    },
    
    saveAlert: function(context) {
		var dataAlert = new Object();
    	dataAlert.id         = context.model.get("id");
		dataAlert.name         = context.model.get("title");
	    dataAlert.description  = context.model.get("description");
	    dataAlert.idcbb        = context.idCBB;

    	var result= $.ajax({
	        type: 'POST',
	        url: '/blueloop-backend/chainBuildingBlockAlert/saveAlertByCBB/',
	        data: JSON.stringify(dataAlert),
	        contentType: 'application/json; charset=utf-8',
	        dataType: 'json',
	        async: false,
	        success: function(data, textStatus) {
	        	toastr.success(json.execution.alertSuccessSave);
	        	
	        	context.model.set("title",context.$el.find("#titleAlert").val());
	            context.model.set("description",context.$el.find("#descriptionAlert").val());
                
                var rowView = new alertRowView( { model: context.model, tableView:context.tableView, idCBB:context.idCBB} );
                context.tableView.$el.find('#alert-table tbody').append(rowView.render().$el);
                context.tableView.datatable.rows.add(rowView.render().$el).draw(); 
                context.tableView.datatable.rows(context.$el).remove().draw();
                context.remove();                
	        },
	    	error: function(httpRequest, textStatus, errorThrown) { 
	     	   console.log("status=" + textStatus + " ,error=" + errorThrown);
	     	   toastr.error(json.bbalerts.errorSaving);
	     	}
		        
    	});
    	
    }
});