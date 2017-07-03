var orderValveRowView = Backbone.View.extend({
    
    template: '/blueloop/static/js/loop/execution/order/orderValve/template/orderValveRowTemplate.ejs',
        
    constructor : function (options) {
        _.extend(this, options);
    },
    
    render: function () {
        this.$el = $(new EJS({url: this.template }).render(this.model.toJSON()));
        this.setEvents();
        return this;
    },
    
    setEvents: function(){
        this.$el.find("#orderActivities").click(this,this.viewOrderActivities);
        this.$el.find("#orderProceed").click(this,this.proceedToNext);
        this.$el.find("#valve-details").click(this,this.viewOrderDetail);
        this.$el.find("#valve-attachments").click(this,this.viewAttachments);
    },
    
    setEvent: function(){
        this.$el.find("#orderProceed").click(this,this.proceedToNext);
    },
    
    viewOrderActivities: function(e){
    	$("#order-valve-act-modal").remove();
    	var modalView = new orderValveActivityModalView({actualValve:e.data.model.get("idValve"),idOrder:e.data.model.get("id"),orderRowView:e.data});
    	modalView.render().$el.modal({backdrop: 'static',keyboard: false});
    },
    
    proceedToNext: function(context) {
    	bootbox.confirm(json.valve.proceedToNext, function (e) {
            if (e) {
                context.data.save(context.data);
            } else {
                return;
            }
        });
    },
    
    save: function(context){
        $.ajax({
            type: 'POST',
            url: '/blueloop/valve/moveOrderToNextValve/',
            data: JSON.stringify({nextValve:context.model.get("nextValve"),idOrder:context.model.get("id")}),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            async: false,
            success: function(data, textStatus) {
                context.tableView.datatable.rows(context.$el).remove().draw();
                orderPopoverController.increaseOrderCounter(context.model.get("nextValve"));
                orderPopoverController.decreaseOrderCounter(context.model.get("actualValve"));
                toastr.success(json.valve.success);
            },
            error: function(httpRequest, textStatus, errorThrown) { 
                toastr.error(httpRequest.responseJSON.error);
            }
        });
    },
    
    viewOrderDetail: function(e) {
        var rowView = new orderSubRowView( { model: e.data.model, type: 1, parentRow: e.data} );   	
        if(e.data.$el.find("i").first().hasClass("fa-minus-circle")){
            e.data.$el.find("i").first().removeClass("fa-minus-circle").addClass("fa-plus-circle");
            e.data.$el.next().find("td.sub-row").slideToggle(200);
            e.data.$el.next().remove();
        }else{
            if(e.data.$el.find("#valve-attachments i").hasClass("fa-minus-circle")){
                e.data.$el.find("#valve-attachments i").removeClass("fa-minus-circle").addClass("fa-plus-circle");
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
        if(e.data.$el.find(".valve-attach").hasClass("fa-minus-circle")){
            e.data.$el.find(".valve-attach").removeClass("fa-minus-circle").addClass("fa-plus-circle");
            e.data.$el.next().find("td.sub-row").slideToggle(200);
            e.data.$el.next().remove();
        }else{
            if(e.data.$el.find("#valve-details i").first().hasClass("fa-minus-circle")){
                e.data.$el.find("#valve-details i").first().removeClass("fa-minus-circle").addClass("fa-plus-circle");
                e.data.$el.next().find("td.sub-row").slideToggle(200);
                e.data.$el.next().remove();
            }
            e.data.$el.find(".valve-attach").removeClass("fa-plus-circle").addClass("fa-minus-circle");
            e.data.$el.after(rowView.render().$el);
            rowView.$el.find("td.sub-row").slideToggle(200);
        }
    },
    
    updateAttachmentCount: function(cant){
        this.model.set("totalAttach", cant)
        this.$el.find("#attach-counter").html(json.general.view + " (" + cant + ")" );
    }
    
});