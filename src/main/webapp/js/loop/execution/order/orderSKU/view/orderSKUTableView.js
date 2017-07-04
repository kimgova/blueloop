var orderSKUTableView = Backbone.View.extend({
    
    template: '/blueloop/static/js/loop/execution/order/orderSKU/template/orderSKUTableTemplate.ejs',
       
    constructor : function (options) {
        _.extend(this, options);
    },

    render: function() {
        this.$el = $(new EJS({url: this.template }).render());
        this.getSkus();
        this.collection.each(this.addRow, this);
        this.initDatatable();
        return this;
    },
    
    getSkus: function() {
        this.collection = new orderSKUCollection([]);
        var result = ajaxCall('GET', '/blueloop/orderChain/getSkusByOrder/', {orderId:this.model.id}, "text/json", "json", false);
        _.each(result,function(item,i){
            var sku = new orderSKUModel({
                id:item.id,
                skuNumber: item.skuNumber,
                skuDescription: item.skuDescription,
                quantity: item.quantity,
                unit: item.unit
            });
            this.collection.push(sku);
        },this); 
    },

    addRow: function(model) {
        var rowView = new orderSKURowView( { model: model } );
         this.$el.find('tbody').append(rowView.render().$el);
    },
    
    initDatatable: function(){
        this.datatable = this.$el.find('#sku-table').DataTable( {
            "autoWidth"        : false,
            "scrollCollapse": true,
            "paging"        : false,
            "processing"    : true,
            "destroy"        : true,
            "jQueryUI"        : false,
            "searching"        : false,
            "info"            : false,
            "select"        : "single",
            "columnDefs"    : [{ "orderable": false, "targets": [ 2 ] }],
        });    
    },
});