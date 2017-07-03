var alertRowView = Backbone.View.extend({
    
    template: '/blueloop/static/js/loop/execution/alert/main/template/alertRowTemplate.ejs',
        
    constructor : function (options) {
		_.extend(this, options);
	},
	
    render: function () {
        this.$el = $(new EJS({url: this.template }).render(this.model.toJSON()));
        this.setEvents();
        return this;
    },
    
    setEvents: function(){
        this.$el.find("#editAlert").click(this,this.editAlert);
        this.$el.find("#deleteAlert").click(this,this.deleteAlert);
    },
    
    editAlert: function(e){
    	var editRowView = new alertEditRowView({ model:e.data.model, tableView:e.data.tableView, idCBB:e.data.idCBB});
        e.data.$el.after(editRowView.render().$el);
        e.data.tableView.datatable.row(e.data.$el).remove();
        e.data.remove();
    },
    
    deleteAlert: function(context){
    	bootbox.confirm(json.bbalerts.deleteConfirm, function (e) {
            if (e) {
                var alertData = {idAlert:context.data.model.get("id"),idcbb:context.data.idCBB};
                var dataReturned = $.ajax({
                    type: 'GET',
                    url: '/blueloop/chainBuildingBlockAlert/deleteAlertByCBB/',
                    data: alertData,
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    async: false,                    
                    success: function(data, textStatus) {
                        context.data.tableView.collection.remove(context.data.model);
                        context.data.tableView.datatable.rows(context.data.$el).remove().draw();
                        toastr.success(json.bbalerts.deleted); 
                        
                    },
                    error: function(httpRequest, textStatus, errorThrown) {
                        console.log("status=" + textStatus + " ,error=" + errorThrown);
                        toastr.error(json.bbalerts.errorSaving);
                    }
                });
            } else {
                return;
            }
        });
    }
    
});