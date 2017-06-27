var orderCBBTableView = Backbone.View.extend({
    
    template: '/blueloop-backend/static/js/loop/execution/order/orderCBB/template/orderCBBTableTemplate.ejs',
       
    constructor : function (options) {
        _.extend(this, options);
    },

    render: function() {
        this.$el = $(new EJS({url: this.template }).render());
        this.getOrders();
        this.collection.each(this.addRow, this);
        this.initDatatable();
        return this;
    },
    
    getOrders: function() {
        this.collection = new orderCBBCollection([]);
        var data = ajaxCall('GET', '/blueloop-backend/orderChain/listOrderByCBB/', {idFormCBB:this.idFormCBB}, "text/json", "json", false);
        
        _.each(data.listOrder,function(item,i){
            var order = new orderCBBModel({
                id:item.id,
                identifier: item.orderNumber,
                status:item.status.name,
                totalAttach:item.totalAttach,
                totalOrderDetail:item.totalOrderDetail,
                pta:item.pta,
                dta:item.dta,
                isLastCBB:data.isLastCBB,
                isOrderResponsible:data.isOrderResponsible
            });
            this.collection.push(order);
        },this); 
    },

    addRow: function(model) {
        var rowView = new orderCBBRowView( { model: model, tableView:this } );
        this.$el.find('tbody').append(rowView.render().$el);
    },
    
    initDatatable: function(){
        this.datatable = this.$el.find('#order-table').DataTable( {
            "autoWidth"         : false,
            "scrollCollapse"    : true,
            "paging"            : false,
            "processing"        : true,
            "destroy"           : true,
            "jQueryUI"          : false,
            "select"            : "single",
            "columnDefs": [{ "orderable": false, "targets": [ 1 ] },
                           { "className": "dt-center", "targets": [0,1,2,3,4,5,6] }]
        });    
    },
});