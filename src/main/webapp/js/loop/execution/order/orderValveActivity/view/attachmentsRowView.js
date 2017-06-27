var attachmentsRowView = Backbone.View.extend({
    
    template: '/blueloop-backend/static/js/loop/execution/order/orderValveActivity/template/attachmentsRowTemplate.ejs',
        
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
        var actData = {id:context.data.model.get("id"),type:context.data.tableView.model.get("type")};
        
        $.fileDownload("/blueloop-backend/valve/downloadAttachment/?id="+actData.id+"&type="+actData.type, {
		    successCallback: function (url) {
		        console.log('Download :' + url);
		    },
		    failCallback: function (html, url) {
		    	console.log('Error downloading from URL:' + url);
		    }
		});
        
//        var dataReturned = $.ajax({
//            type: 'POST',
//            url: '/blueloop-backend/valve/downloadAttachment/',
//            data: JSON.stringify(actData),
//            contentType: 'application/json; charset=utf-8',
//            dataType: 'json',
//            async: false,
//            beforeSend: function() { 
//                $("body").addClass("loading");    
//            },
//            success: function(data, textStatus) {
//                window.open(data.urlS3); 
//                $("body").removeClass("loading");
//            },
//            error: function(httpRequest, textStatus, errorThrown) {
//                $("body").removeClass("loading");
//                console.log("status=" + textStatus + " ,error=" + errorThrown);
//                toastr.error(json.error.tryAgain);
//            }
//        });
    },
    
    editAttachment: function(e) {
        var editRowView = new attachmentsEditRowView({ model:e.data.model, tableView:e.data.tableView });
        e.data.$el.after(editRowView.render().$el);
        e.data.tableView.datatable.row(e.data.$el).remove();
        e.data.remove();
    },
    
    deleteAttachment: function(context) {
		if( context.data.tableView.model.get("status") =="checked" && 
			context.data.tableView.model.get("requireAttachments") == true &&  
			context.data.tableView.model.get("attachments").length <= 1 ){
			
			toastr.error(json.activity.errorRemoveAttachments);
		}else{
			bootbox.confirm(json.file.deleteConfirm, function (e) {
	            if (e) {
	                var actData = {id:context.data.model.get("id"),type:context.data.tableView.model.get("type")};
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
	                        context.data.tableView.collection.remove(context.data.model);
	                        context.data.tableView.model.set("attachments",context.data.tableView.collection.toJSON());
	                        context.data.tableView.activityView.updateAttachmentCount(context.data.tableView.model.get("attachments").length);
	                        context.data.tableView.datatable.rows(context.data.$el).remove().draw();
	                        context.data.tableView.activityView.parentModal.setTotalAttachments("subtract");
	                        context.data.tableView.activityView.parentModal.updateAttCount();
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