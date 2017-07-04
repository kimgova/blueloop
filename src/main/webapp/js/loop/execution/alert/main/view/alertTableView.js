var alertTableView = Backbone.View.extend({
    
	template: '/blueloop/static/js/loop/execution/alert/main/template/alertTableTemplate.ejs',
       
    constructor : function (options) {
		_.extend(this, options);
	},

    render: function() {
        this.$el = $(new EJS({url: this.template }).render());
        this.collection.each(this.addRow, this);
        this.initDatatable();
        return this;
    },
 
    addRow: function(model) {
        var rowView = new alertRowView( { model: model, tableView:this.tableView, idCBB:this.idCBB} );
        this.$el.find('tbody').append(rowView.render().$el);
    },
    
    initDatatable: function(){
    	this.datatable = this.$el.find('#alert-table').DataTable( {
    		"autoWidth"		: false,
			"scrollCollapse": true,
			"paging"		: false,
			"processing"	: true,
			"destroy"		: true,
			"jQueryUI"		: false,
			"select"		: "single",
			"columnDefs": [{ "orderable": true, "targets": [ 1,2 ] },
	              		   { "className": "center", "targets": [ 0,1,2 ] }],
		});	
    },
});