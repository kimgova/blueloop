var loopStepView = Backbone.View.extend({
    
	template: '/blueloop/static/js/admin/userAccounts/deleteUser/template/loopTableTemplate.ejs',
       
    constructor : function (options) {
		_.extend(this, options);
	},

    render: function() {
        this.$el = $(new EJS({url: this.template }).render());
        this.getLoopList();
        this.loopCollection.each(this.addRow, this);
        this.initDatatable();
        return this;
    },
    
    getLoopList: function() {
    	if(this.loopCollection.length == 0){
        	var result = ajaxCall('GET', '/blueloop/chain/getLoopsByUser/', {idUser:this.model.id}, "text/json", "json", false);
        	_.each(result.chainList,function(item,i){
        		var loop = new loopModel({
        			id : item.id,
                    name : item.description,
                    owner : item.userCreator.id,
                    image : "../static/images/home/loop.png"
        		});
        		this.loopCollection.push(loop);
    	    },this);
    	}
    },

    addRow: function(model) {
        var rowView = new loopRowView( { model: model, userCollection:this.userCollection } );
        this.$el.find('tbody').append(rowView.render().$el);
    },
    
    initDatatable: function(){
    	this.datatable = this.$el.find('#loop-table').DataTable( {
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