var bbStepView = Backbone.View.extend({
    
	template: '/blueloop/static/js/admin/userAccounts/deleteUser/template/bbTableTemplate.ejs',
       
    constructor : function (options) {
		_.extend(this, options);
	},

    render: function() {
        this.$el = $(new EJS({url: this.template }).render());
        this.getBBList();
        this.bbCollection.each(this.addRow, this);
        this.initDatatable();
        return this;
    },
    
    getBBList: function() {
    	if(this.bbCollection.length == 0){
        	var result = ajaxCall('GET', '/blueloop/buildingBlock/getAllBBByUser/', {idUser:this.model.id}, "text/json", "json", false);
        	_.each(result,function(item,i){
        		var bb = new bbModel({
        			id : item.id,
                    name : item.name,
                    owner : item.owner.id,
                    image : "https://s3-us-west-1.amazonaws.com/blapp-assets/" + item.fileName
        		});
        		this.bbCollection.push(bb);
    	    },this);
    	}
    },

    addRow: function(model) {
        var rowView = new bbRowView( { model: model, userCollection:this.userCollection } );
        this.$el.find('tbody').append(rowView.render().$el);
    },
    
    initDatatable: function(){
    	this.datatable = this.$el.find('#bb-table').DataTable( {
    		"autoWidth"		: false,
			"scrollCollapse": true,
			"paging"		: true,
			"processing"	: true,
			"destroy"		: true,
			"jQueryUI"		: false,
			"lengthChange"  : false,
			"pageLength"    : 5,
			"select"		: "single",
			"columnDefs": [{ "orderable": false, "targets": [ 0,2 ] },
	              		   { "className": "center", "targets": [ 0,1,2 ] }],
		});	
    }
    
});