var TeamworkTableView = Backbone.View.extend({
    
	template: '/blueloop-backend/static/js/loop/create_edit/teamwork/main/template/TeamworkTable.ejs',
       
    constructor : function (options) {
		_.extend(this, options);
	},

    render: function() {
        this.$el = $(new EJS({url: this.template }).render());
        this.collection.each(this.addRow, this);    
        return this;
    },

    addRow: function(model) {
        var rowView = new TeamMemberRowView( { model: model, parent:this } );
 		this.$el.find('tbody').append(rowView.render().$el);
    },
    
    removeRow: function(member){
    	 this.parent.model.members.each(function(model,i){
			if(model != undefined){
				if(model.cid == member.cid){
					this.parent.model.members.models.splice(i,1);
					this.parent.model.membersRemove.add(model);
				}
			}
		},this); 
    	this.parent.resetDatatable();
    },
    
    initDatatable: function(){
    	this.datatable = this.$el.find('#teamworkTable').DataTable( {
    		"autoWidth"		: false,
			"scrollCollapse": true,
			"paging"		: false,
			"processing"	: true,
			"destroy"		: true,
			"jQueryUI"		: false,
			"select"		: "single",
			"columnDefs": [{ "orderable": false, "targets": [ 3,4,5,6,7] },
		            	   { "className": "center", "targets": [ 0,1,2,3,4 ] }]
		});	
    },
});