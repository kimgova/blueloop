var attachmentsNewRowView = Backbone.View.extend({
	
	template: '/blueloop-backend/static/js/loop/execution/order/orderValveActivity/template/attachmentsNewRow.ejs',
		
	constructor : function (options) {
		_.extend(this, options);
	},
	
	render: function () {
		this.$el = $(new EJS({url: this.template }).render({date: new Date()}));
		this.$el.find("#saveAttach").click(this,this.saveNewAttach);
		this.$el.find("#cancelAttach").click(this,this.cancelNewAttach);
		return this;
	},
	
	setFile: function(inputFile){
        this.$el.find("#filenameAttach").text($(inputFile).context.files[0].name);
	},
	
	saveNewAttach: function(e){
		var attachmentDescription = e.data.$el.find("#descriptionAttach").val();
		if(e.data.validate(attachmentDescription,e.data.model.get("attachments").length)){
			e.data.tableView.activityView.$el.find("#addAttachment").removeAttr("disabled");			
			e.data.tableView.activityView.$el.find("#formNewAttach").ajaxSubmit({
	            async: true,
	            url: "/blueloop-backend/valve/addAttachmentActivity",
	            data: {idValveOrder: e.data.model.get("idValveOrder"), type: e.data.model.get("type"), attachmentDescription: attachmentDescription},
	            beforeSubmit: function() { 
	            	$("body").addClass("loading");    
	 			},
	            success: function (data) {
	            	$("body").removeClass("loading"); 
	                e.data.model.get("attachments").push(data);
	                toastr.success(json.file.attachmentAdded); 
	                
	                var model = new attachmentsActModel({
	                        id:data.id,
	                        fileName:data.fileName,
	                        description:data.description,
	                        filePath:data.filePath,
	                        creationDate:data.creationDate,
	                        isResponsible:e.data.model.get("isResponsible")
	                });
	                e.data.tableView.collection.push(model);

	                var rowView = new attachmentsRowView({model:model, tableView:e.data.tableView});
	                e.data.tableView.datatable.rows.add(rowView.render().$el).draw(); 
	                e.data.tableView.datatable.rows(e.data.$el).remove().draw();
	                e.data.remove();
	                
	                e.data.tableView.activityView.updateAttachmentCount(e.data.model.get("attachments").length);
	                e.data.tableView.activityView.$el.find("#addAttachment").removeAttr("disabled");
	                e.data.tableView.activityView.$el.find("#addAttachment").parent().parent().removeClass("disabled");
	                e.data.tableView.activityView.parentModal.setTotalAttachments(1);
	                e.data.tableView.activityView.parentModal.updateAttCount();
	            },
	            error: function(httpRequest, textStatus, errorThrown) { 
	            	$("body").removeClass("loading"); 
	            	e.data.tableView.activityView.$el.find("#addAttachment").attr("disabled","true");
	                console.log("status=" + textStatus + " ,error=" + errorThrown);
	                toastr.error(httpRequest.responseJSON.error);
	              }
	        });
		}
	},
	
	validate: function(attachmentDescription,totalAttachments){
		var valid = true;
		if(attachmentDescription.trim() == "" || /^\s*$/.test(attachmentDescription)){
			toastr.error(json.file.errorEmptyDescription);
			valid = false;
		}
		if(totalAttachments == 5){
			toastr.error(json.file.errorMaxAttachments);
			valid = false;
		}	
		return valid;
	},
	
	cancelNewAttach: function(e) {
		e.data.tableView.datatable.rows(e.data.$el).remove().draw();
		e.data.remove();
		e.data.tableView.activityView.$el.find("#addAttachment").removeAttr("disabled");
		e.data.tableView.activityView.$el.find("#addAttachment").parent().parent().removeClass("disabled");
	}
});