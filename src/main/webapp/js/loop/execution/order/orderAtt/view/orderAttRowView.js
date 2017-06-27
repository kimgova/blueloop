var orderAttRowView = Backbone.View.extend({
    
    template: '/blueloop-backend/static/js/loop/execution/order/orderAtt/template/orderAttRowTemplate.ejs',
        
    constructor : function (options) {
        _.extend(this, options);
    },
    
    render: function () {
        this.$el = $(new EJS({url: this.template}).render(this.model.toJSON()));
        this.setEvents();
        return this;
    },
    
    setEvents: function(){
        this.$el.find("#downloadAttachment").click(this,this.downloadAttachment);
        this.$el.find("#editAttachment").click(this,this.editAttachment);
        this.$el.find("#deleteAttachment").click(this,this.deleteAttachment);
    },
    
    downloadAttachment: function(context) {
        var actData = {id:context.data.model.get("id"),type:context.data.model.get("type")};
        
        $.fileDownload("/blueloop-backend/valve/downloadAttachment/?id="+actData.id+"&type="+actData.type, {
		    successCallback: function (url) {
		        console.log('Download :' + url);
		    },
		    failCallback: function (html, url) {
		    	console.log('Error downloading from URL:' + url);
		    }
		});
    },
    
    editAttachment: function(e) {
        var editRowView = new orderAttEditRowView({ model:e.data.model, tableView:e.data.tableView });
        e.data.$el.after(editRowView.render().$el);
        e.data.tableView.datatable.row(e.data.$el).remove();
        e.data.remove();
    },
    
    deleteAttachment: function(context) {
    	console.log(context)
		if( context.data.model.get("checked") == true && 
			context.data.model.get("require") == true &&  
			context.data.tableView.collection.length <= 1 ){
			
			toastr.error(json.activity.errorRemoveAttachments);
		}else{
			bootbox.confirm(json.file.deleteConfirm, function (e) {
	            if (e) {
	                var actData = {id:context.data.model.get("id"),type:context.data.model.get("type")};
	                var dataReturned = $.ajax({
	                    type: 'POST',
	                    url: '/blueloop-backend/valve/deleteAttachment/',
	                    data: JSON.stringify(actData),
	                    contentType: 'application/json; charset=utf-8',
	                    dataType: 'json',
	                    async: false,
	                    beforeSend: function() { 
	                        $("body").addClass("loading");    
	                    },
	                    success: function(data, textStatus) {
	                        if(context.data.model.get("type") == 2){
	                            context.data.tableView.flowCollection.remove(context.data.model);
	                            context.data.tableView.parentRow.updateAttachmentCount();
	                        }else{
	                            context.data.tableView.collection.remove(context.data.model);
	                        }
	                        var total = context.data.tableView.flowCollection.length + context.data.tableView.collection.length;
	                        context.data.tableView.parentRow.updateAttachmentCount(total);
	                        context.data.tableView.datatable.rows(context.data.$el).remove().draw();
	                        toastr.success(json.file.attachmentRemoved); 
	                        $("body").removeClass("loading");
	                    },
	                    error: function(httpRequest, textStatus, errorThrown) {
	                        $("body").removeClass("loading");
	                        console.log("status=" + textStatus + " ,error=" + errorThrown);
	                        toastr.error(json.error.tryAgain);
	                    }
	                });
	            } else {
	                return;
	            }
	        });
		}
    }
});