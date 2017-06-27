var orderValveTableView = Backbone.View.extend({
    
    template: '/blueloop-backend/static/js/loop/execution/order/orderValve/template/orderValveTableTemplate.ejs',
       
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
        this.collection = new orderValveCollection([]);
        var result = ajaxCall('GET', '/blueloop-backend/valve/getOrdersInValve/', {idFormLeft:this.idFormLeft,idValve:this.idValve,idFormRight:this.idFormRight}, "text/json", "json", false);
        _.each(result.listOrders,function(item,i){
            var disabled = "";
            if(!item.readyToProceed){
                disabled = "disabled";
            }
            var order = new orderValveModel({
                id:item.id,
                orderNumber: item.orderNumber,
                status:item.status.name,
                totalAttach:item.totalAttach,
                totalOrderDetail:item.totalOrderDetail,
                pta:item.pta,
                dta:item.dta,
                isOrderResponsible:item.isOrderResponsible,
                disabled:disabled,
                nextValve:this.idFormRight,
                actualValve:this.idFormLeft,
                idValve:this.idValve
            });
            this.collection.push(order);
        },this);
    },

    addRow: function(model) {
        var rowView = new orderValveRowView( { model: model, tableView:this } );
        this.$el.find('tbody').append(rowView.render().$el);
    },
    
    initDatatable: function(){
        this.datatable = this.$el.find('#order_valve_table').DataTable( {
            "autoWidth"     : false,
            "scrollCollapse": true,
            "paging"        : false,
            "processing"    : true,
            "destroy"       : true,
            "jQueryUI"      : false,
            "select"        : "single",
            "columnDefs": [{ "orderable": false, "targets": [ 2 ] },
                           { "className": "dt-center", "targets": [ 0,1,2,3,4,5,6 ] }],
        }); 
    }
});