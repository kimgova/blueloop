var teamworkTableView = Backbone.View.extend({
    
	template: '/blueloop/static/js/teamwork/main/template/teamworkTable.ejs',
       
    constructor : function (options) {
		_.extend(this, options);
	},

    render: function() {
        this.$el = $(new EJS({url: this.template }).render());
        this.getTeamworks();
        this.collection.each(this.addRow, this);
        this.initDatatable();
        return this;
    },
    
    getTeamworks: function(){
    	this.collection = new teamworkCollection([]);
    	var result = ajaxCall('GET', '/blueloop/teamwork/getAllTeamwork/', {}, "text/json", "json", false);

    	_.each(result.bbTeams,function(item,i){   
    		var team = new teamworkModel({
    			id:				item.id,
    			name: 			item.name,
    			description: 	item.description,
    			objid: 			item.bbid,
    			objname:		item.bbname,
    			type: 			item.type
    		});
    		this.collection.push(team);       	
    	},this);

    	_.each(result.loopTeams,function(item,i){
    		var team = new teamworkModel({
    			id:				item.id,
    			name: 			item.name,
    			description: 	item.description,
    			objid: 			item.loopid,
    			objname: 		item.loopname,
    			type: 			item.type
    		});
    		this.collection.push(team);
    	},this);
    },

    addRow: function(model) {
        var rowView = new teamworkRowView( { model: model, tableView:this } );
 		this.$el.find('tbody').append(rowView.render().$el);
    },
    
    initDatatable: function(){
    	this.datatable = this.$el.find('#twTable').DataTable( {
    		"autoWidth"		: false,
			"scrollCollapse": true,
			"paging"		: false,
			"processing"	: true,
			"destroy"		: true,
			"jQueryUI"		: false,
			"select"		: false,
			"columnDefs": [{ "orderable": false, "targets": [ 0,3 ] },
	              		   { "className": "center", "targets": [ 0,3 ] }]
		});	
    },
});

$().ready(function() {
	var tableView = new teamworkTableView();
	$("#tw-content").append(tableView.render().$el)
});