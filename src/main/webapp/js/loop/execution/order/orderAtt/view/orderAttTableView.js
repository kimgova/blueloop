var orderAttTableView = Backbone.View.extend({
    
    template: '/blueloop/static/js/loop/execution/order/orderAtt/template/orderAttTableTemplate.ejs',
       
    constructor : function (options) {
        _.extend(this, options);
    },

    render: function() {
        this.$el = $(new EJS({url: this.template }).render({}));
        this.setCollection();
        this.collection.each(this.addRow, this);
        this.flowCollection.each(this.addRow, this);
        this.initDatatable();
        this.setEvents();
        return this;
    },
    
    setCollection: function() {
        this.collection = new orderAttCollection([]);
        this.flowCollection = new orderAttFowCollection([]);
        var result = ajaxCall('GET', '/blueloop/orderChain/getAllOrderAttachments/', {orderId:this.model.id}, "text/json", "json", false);
        _.each(result.attList,function(item,i){
            var model = new orderAttModel({
                id:item.id,
                fileName:item.fileName,
                description:item.description,
                filePath:item.filePath,
                creationDate:item.creationDate,
                uploader:item.uploader,
                isResponsible:item.isResponsible,
                checked:item.checked,
                required:item.required,
                type:1
            },this);
            this.collection.push(model);
        },this);
        
        _.each(result.flowList,function(item,i){
            var model = new orderAttFlowModel({
                id:item.id,
                fileName:item.fileName,
                description:item.description,
                filePath:item.filePath,
                creationDate:item.creationDate,
                uploader:item.uploader,
                isResponsible:item.isResponsible,
                checked:item.checked,
                required:item.required,
                type:2
            },this);
            this.flowCollection.push(model);
        },this);
    },

    addRow: function(model) {
        var rowView = new orderAttRowView( { model: model, tableView:this } );
        this.$el.find('tbody').append(rowView.render().$el);
    },
    
    initDatatable: function(){
        this.datatable = this.$el.find('#activ_attach_table').DataTable( {
            "autoWidth"     : false,
            "scrollCollapse": true,
            "searching"		: false,
            "paging"        : false,
            "processing"    : true,
            "destroy"       : true,
            "jQueryUI"      : false,
            "select"        : "single",
            "columnDefs"	: [{ "orderable": false, "targets": [ 3 ] },
                        	   { "className": "dt-center", "targets": [ 0,1,2,3,4 ] }],
        }); 
    },
    
    setEvents: function(){
    	var that = this;
    	this.$el.find("#activ_attach_table thead th").click(function() {
    		if($(this).hasClass('sorting') || $(this).hasClass('sorting_asc') || $(this).hasClass('sorting_desc')){
    			that.$el.find("#addAttachment").removeAttr("disabled","true");
    			that.$el.find("#addAttachment").parent().parent().removeClass("disabled");
    		}
    	} );
    }
});