var orderRowView = Backbone.View.extend({
    
    template: '/blueloop/static/js/loop/execution/order/main/template/orderRowTemplate.ejs',
        
    constructor : function (options) {
		_.extend(this, options);
	},
	
    render: function () {
        this.$el = $(new EJS({url: this.template }).render(this.model.toJSON()));
        this.setEvents();
        return this;
    },
    
    setEvents: function(){
        this.$el.find("#view-details").click(this,this.viewOrderDetail);
        this.$el.find("#view-attachments").click(this,this.viewAttachments);
        this.$el.find("#editOrder").click(this,this.editOrder);
        this.$el.find("#deleteOrder").click(this,this.deleteOrder);
    },
    
    viewOrderDetail: function(e) {
    	var rowView = new orderSubRowView( { model: e.data.model, type: 1, parentRow: e.data} );
    	if(e.data.$el.find("i").first().hasClass("fa-minus-circle")){
    		e.data.$el.find("i").first().removeClass("fa-minus-circle").addClass("fa-plus-circle");
    		e.data.$el.next().find("td.sub-row").slideToggle(200);
    		e.data.$el.next().remove();
    	}else{
    		if(e.data.$el.find("#view-attachments i").hasClass("fa-minus-circle")){
                e.data.$el.find("#view-attachments i").removeClass("fa-minus-circle").addClass("fa-plus-circle");
                e.data.$el.next().find("td.sub-row").slideToggle(200);
                e.data.$el.next().remove();
            }
    		e.data.$el.find("i").first().removeClass("fa-plus-circle").addClass("fa-minus-circle");
    		e.data.$el.after(rowView.render().$el);
     		rowView.$el.find("td.sub-row").slideToggle(200);
    	}
    },
    
    viewAttachments: function(e) {
    	var rowView = new orderSubRowView( { model: e.data.model, type: 2, parentRow: e.data} );
    	if(e.data.$el.find("#view-attach").hasClass("fa-minus-circle")){
    		e.data.$el.find("#view-attach").removeClass("fa-minus-circle").addClass("fa-plus-circle");
    		e.data.$el.next().find("td.sub-row").slideToggle(200);
    		e.data.$el.next().remove();
    	}else{
    		if(e.data.$el.find("#view-details i").hasClass("fa-minus-circle")){
                e.data.$el.find("#view-details i").removeClass("fa-minus-circle").addClass("fa-plus-circle");
                e.data.$el.next().find("td.sub-row").slideToggle(200);
                e.data.$el.next().remove();
            }
    		e.data.$el.find("#view-attach").removeClass("fa-plus-circle").addClass("fa-minus-circle");
    		e.data.$el.after(rowView.render().$el);
     		rowView.$el.find("td.sub-row").slideToggle(200);
    	}
    },
    
    updateAttachmentCount: function(cant){
    	this.model.set("attachments", cant)
    	this.$el.find("#attach-counter").html(json.general.view + " (" + cant + ")" );
    },
    
    editOrder: function(e){
        $("#new-order-modal").remove();	
    	var modalView = new createEditOrderModalView({idSequence:0,parentModal:e.data.parentModal,idOrderChain:e.data.model.get('id')});
    	modalView.render().$el.modal("show");
    },
    
    deleteOrder: function(context){

    	bootbox.confirm(json.order.confirmDelete, function (e) {
            if(e){
                var dataReturned = $.ajax({
                    type : 'GET',
                    url : '/blueloop/orderChain/deleteOrder/',
                    data : {idOrder:context.data.model.get("id")},
                    contentType : 'application/json; charset=utf-8',
                    dataType : 'json',
                    async : false,
                    success : function(data, textStatus) {
                        data = data;
                    },
                    error : function(httpRequest, textStatus, errorThrown) {
                        console.log("status=" + textStatus + " ,error=" + errorThrown);
                        toastr.error(httpRequest.responseJSON.error);
                    }
                });

                if(dataReturned.responseJSON.success){
                	toastr.success(json.order.confirmingDelete);
                	if(context.data.model.get("status")=="EXECUTED" || context.data.model.get("status")=="ANNULLED"){
                        context.data.ordersCollection.remove(context.data.model);
                        context.data.tableView.collection.remove(context.data.model);
                        context.data.tableView.datatable.rows(context.data.$el).remove().draw();
                        context.data.$el.remove();
                	}else{
                		orderPopoverController.decreaseOrderCounter(dataReturned.responseJSON.currentBB);
                		context.data.model.set("status", "ANNULLED");
                		context.data.model.set("step", "");
                		var rowView = new orderRowView( { model: context.data.model, ordersCollection:context.data.ordersCollection,parentModal:context.data.parentModal, tableView:context.data.tableView } );
                		$('#order-table tbody').append(rowView.render().$el);
                		context.data.tableView.datatable.rows.add(rowView.render().$el).draw(); 
                		context.data.tableView.datatable.rows(context.data.$el).remove().draw();
                		context.data.$el.remove();
                	}
                	if($(".selectedFilter").attr('val') == "EXECUTED"){
                        context.data.tableView.filter(['EXECUTED']);
                    }else if($(".selectedFilter").attr('val') == "ANNULLED"){
                        context.data.tableView.filter(['ANNULLED']);
                    }else if($(".selectedFilter").attr('val') == "TRANSIT"){
                        context.data.tableView.filter(['ONTIME', 'DELAYED', 'AHEAD']);
                    }else if($(".selectedFilter").attr('val') == "ALL"){
                        context.data.tableView.filter(['ONTIME', 'DELAYED', 'AHEAD','EXECUTED','ANNULLED']);
                    }
                }
            } else {
                return;
            }
        });
    }
    
});