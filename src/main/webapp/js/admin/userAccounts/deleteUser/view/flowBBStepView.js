var flowBBStepView = Backbone.View.extend({
    
    template: '/blueloop/static/js/admin/userAccounts/deleteUser/template/flowTableTemplate.ejs',
       
    constructor : function (options) {
        _.extend(this, options);
    },

    render: function() {
        this.$el = $(new EJS({url: this.template }).render());
        this.getBBList();
        this.flowCollection.each(this.addRow, this);
        this.initDatatable();
        return this;
    },
    
    getBBList: function() {
        if(this.flowCollection.length == 0){
            var result = ajaxCall('GET', '/blueloop/buildingBlock/getAllFlowResponsible/', {id:this.model.id}, "text/json", "json", false);
            _.each(result.listFlowBB,function(item,i){
                var bb = new bbModel({
                    id          : item.id,
                    act_name    : item.act_name,
                    responsible : item.responsible,
                    bb_name     : item.bb_name,
                    flow_id     : item.flow_id,
                    image       : item.image,
                    flowTeam    : item.flowTeam,
                    chain       : item.chain,
                    valveList   : item.valveList
                });
                this.flowCollection.push(bb);
            },this);
        }
    },
    
    addRow: function(model) {
        var rowView = new flowBBRowView( { model: model, userCollection:this.userCollection } );
        this.$el.find('tbody').append(rowView.render().$el);
    },
    
    initDatatable: function(){
        this.datatable = this.$el.find('#flow-table').DataTable( {
            "autoWidth"     : false,
            "scrollCollapse": true,
            "paging"        : true,
            "processing"    : true,
            "destroy"       : true,
            "jQueryUI"      : false,
            "lengthChange"  : false,
            "pageLength"    : 5,
            "select"        : "single",
            "columnDefs": [{ "orderable": false, "targets": [ 0,4 ] },
                           { "className": "center", "targets": [ 0,1,2,3,4 ] }],
        }); 
    }
    
});