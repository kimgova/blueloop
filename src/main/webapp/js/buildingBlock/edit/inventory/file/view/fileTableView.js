var fileTableView = Backbone.View.extend({
    
	template: '/blueloop/static/js/buildingBlock/edit/inventory/file/template/fileTableTemplate.ejs',
       
    constructor : function (options) {
		_.extend(this, options);
	},

    render: function() {
        this.$el = $(new EJS({url: this.template }).render());
        this.getFiles();
        this.collection.each(this.addRow, this);
        this.initDatatable();
        return this;
    },
    
    getFiles: function() {
    	this.collection = new fileUpCollection([]);
    	var result = ajaxCall('GET', '/blueloop/loadFile/getListUploadFiles/', {idBB:this.idBB}, "text/json", "json", false);
    	_.each(result,function(item,i){
    		var file = new fileUpModel({
    			id : item.id,
                fileName : item.fileName,
                date : item.uploadDate,
			    user : item.user,
			    time : item.uploadTime
    		});
    		this.collection.push(file);
	    },this); 
    },

    addRow: function(model) {
        var rowView = new fileRowView( { model: model } );
        this.$el.find('tbody').append(rowView.render().$el);
    },
    
    initDatatable: function(){
    	this.datatable = this.$el.find('#file-table').DataTable( {
    		"autoWidth"		: false,
			"scrollCollapse": true,
			"paging"		: false,
			"processing"	: true,
			"destroy"		: true,
			"jQueryUI"		: false,
			"select"		: "single",
			"columnDefs": [{ "orderable": false, "targets": [ 1,2 ] },
	              		   { "className": "center", "targets": [ 0,1,2 ] }],
		});	
    }
    
});