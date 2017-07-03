var activityFlowTabView = Backbone.View.extend({
    
    template: '/blueloop/static/js/buildingBlock/edit/flowBBActivities/template/tabpane_template.ejs',
       
    constructor : function (options) {
        _.extend(this, options);
    },

    render: function() {
        this.$el = $(new EJS({url: this.template }).render());
        this.getActivities();
        this.collection.each(this.addRow, this);
        this.initDatatable();
        this.setEvents();
        return this;
    },
    
    getActivities: function(){
        this.collection = new activityFlowCollection([]);
        var result = ajaxCall('GET', '/blueloop/activityBuildingBlock/getAllFlowBBActivities/', {idBB:this.bb_id}, "text/json", "json", false);

        _.each(result,function(item,i){
            var activity = new activityFlowModel({
                id:         item.id,
                name:       item.description,
                imageURI:   item.imgURI,
                haveOrders: item.haveOrders,
                fileName:   item.fileName
            });
            this.collection.push(activity);
        },this);
    },

    addRow: function(model) {
        var rowView = new activityFlowRowView( { model: model, tableView:this } );
        this.$el.find('tbody').append(rowView.render().$el);
    },
    
    newRow: function(e) {
        var rowView = new newActivityFlowRowView( { tableView:e.data } );
        e.data.datatable.row.add(rowView.render().$el).draw().node();
    },
    
    addNewRow: function(model) {
        var rowView = new activityFlowRowView( { model: model, tableView:this } );
        return rowView.render().$el;
    },
    
    setEvents: function(){
        this.$el.find("#newFlowActivity").click(this,this.newRow);
    },
    
    initDatatable: function(){
        this.datatable = this.$el.find('#tabFlowBB').DataTable( {
            "autoWidth"     : false,
            "scrollCollapse": true,
            "paging"        : true,
            "pageLength"    : 10,
            "lengthChange"  : false,
            "processing"    : true,
            "destroy"       : true,
            "jQueryUI"      : false,
            "select"        : false,
            "columnDefs": [{ "orderable": false, "targets": [ 0,2 ] },
                           { "className": "center", "targets": [ 0,1,2 ] }]
        }); 
    }
});
