var attachmentsTableView = Backbone.View.extend({
    
    template: '/blueloop-backend/static/js/loop/execution/order/orderValveActivity/template/attachmentsTableTemplate.ejs',
       
    constructor : function (options) {
        _.extend(this, options);
    },

    render: function() {
        this.$el = $(new EJS({url: this.template }).render({isResponsible:this.model.get("isResponsible")}));
        this.setCollection();
        this.collection.each(this.addRow, this);
        this.initDatatable();
        this.setEvents();
        return this;
    },
    
    setCollection: function() {
        this.collection = new attachmentsActCollection([]);
        var isResponsible = this.model.get("isResponsible");
        _.each(this.model.get("attachments"),function(item,i){
            var model = new attachmentsActModel({
                id:item.id,
                fileName:item.fileName,
                description:item.description,
                filePath:item.filePath,
                creationDate:item.creationDate,
                isResponsible:isResponsible
            });
            this.collection.push(model);
        },this);
    },

    addRow: function(model) {
        var rowView = new attachmentsRowView( { model: model, tableView:this } );
        this.$el.find('tbody').append(rowView.render().$el);
    },
    
    addNewRowAttachment: function(e){
    	if($(e.target).context.files[0] != undefined){
    		if(e.data.collection.models.length == 0){
        		e.data.$el.find('tbody').html("");
        	}
        	
        	e.data.$el.find("#addAttachment").attr("disabled","true");
        	e.data.$el.find("#addAttachment").parent().parent().addClass("disabled");
        	
            var newRowView = new attachmentsNewRowView( { tableView:e.data, model:e.data.model} );
            e.data.$el.find('tbody').prepend(newRowView.render().$el);
            newRowView.setFile($(e.target))
    	}   	
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
            "columnDefs": [{ "orderable": false, "targets": [ 3 ] },
                           { "className": "dt-center", "targets": [ 0,1,2,3 ] }],
        }); 
    },
    
    setEvents: function(){
    	this.$el.find("#addAttachment").change(this,this.addNewRowAttachment);
    	
    	var that = this;
    	this.$el.find("#activ_attach_table thead th").click(function() {
    		if($(this).hasClass('sorting') || $(this).hasClass('sorting_asc') || $(this).hasClass('sorting_desc')){
    			that.$el.find("#addAttachment").removeAttr("disabled","true");
    			that.$el.find("#addAttachment").parent().parent().removeClass("disabled");
    		}
    	} );
    }
});