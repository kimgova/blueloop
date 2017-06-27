var orderCBBRowView = Backbone.View.extend({
    
    template: '/blueloop-backend/static/js/loop/execution/order/orderCBB/template/orderCBBRowTemplate.ejs',
        
    constructor : function (options) {
        _.extend(this, options);
    },
    
    render: function () {
        this.$el = $(new EJS({url: this.template }).render(this.model.toJSON()));
        this.setEvents();
        return this;
    },
    
    setEvents: function(){
        this.$el.find("#endOrderChain").click(this,this.endOrder);
        this.$el.find("#cbb-details").click(this,this.viewOrderDetail);
        this.$el.find("#cbb-attachments").click(this,this.viewAttachments);
    },
    
    endOrder: function(context){
    	bootbox.confirm(json.order.end, function (e) {
            if (e) {
                var dataAjax = ajaxCall('GET','/blueloop-backend/orderChain/endOrder/', {id:context.data.model.id}, "text/json", "json", false);
                if(dataAjax != undefined){
                    context.data.tableView.datatable.rows(context.data.$el).remove().draw();
                    toastr.success(json.order.ended);
                }
            } else {
                return;
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
            if(e.data.$el.find("#cbb-attachments i").hasClass("fa-minus-circle")){
                e.data.$el.find("#cbb-attachments i").removeClass("fa-minus-circle").addClass("fa-plus-circle");
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
        if(e.data.$el.find(".cbb-attach").hasClass("fa-minus-circle")){
            e.data.$el.find(".cbb-attach").removeClass("fa-minus-circle").addClass("fa-plus-circle");
            e.data.$el.next().find("td.sub-row").slideToggle(200);
            e.data.$el.next().remove();
        }else{            
            if(e.data.$el.find("#cbb-details i").hasClass("fa-minus-circle")){
                e.data.$el.find("#cbb-details i").removeClass("fa-minus-circle").addClass("fa-plus-circle");
                e.data.$el.next().find("td.sub-row").slideToggle(200);
                e.data.$el.next().remove();
            }
            e.data.$el.find(".cbb-attach").removeClass("fa-plus-circle").addClass("fa-minus-circle");
            e.data.$el.after(rowView.render().$el);
            rowView.$el.find("td.sub-row").slideToggle(200);
        }
    },
    
    updateAttachmentCount: function(cant){
        this.model.set("totalAttach", cant)
        this.$el.find("#attach-counter").html(json.general.view + " (" + cant + ")" );
    }
    
});