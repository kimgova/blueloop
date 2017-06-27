var mapModalView = Backbone.View.extend({
    
    template: '/blueloop-backend/static/js/buildingBlock/edit/inventory/map/template/mapModal.ejs',
    
    constructor : function (options) {
        _.extend(this, options);
    },

    render: function() {
        this.$el = $(new EJS({url: this.template}).render());

        this.setMapColumnsCollection();
        
        if(this.collection.length > 0){
            this.$el.find('tbody').empty();
        }
        
        this.collection.each(this.addRow, this);
        
        this.setEvents();
        return this;
    },
    
    setEvents: function(){
        this.$el.find("#editMap").click(this,this.editMap);
        this.$el.find("#nextMap").click(this,this.nextMap);
        this.$el.css({overflow:"auto"}); 
    },
    
    editMap: function(e){
        var mapEditView = new mapModalEditView({model:e.data.model, collection:e.data.collection});
        mapEditView.render().$el.modal({backdrop: 'static',keyboard: false});
        e.data.$el.modal("hide");
    },
    
    backMap: function(e){
        e.data.$el.remove();
        $("#modalSelectFile").modal("show");
    },
    
    nextMap: function(e){
    	e.data.$el.modal("hide");
    },
    
    setMapColumnsCollection: function(){
    	var data = ajaxCall('GET','/blueloop-backend/loadFile/getFileMapping/', {idBB:this.idBB}, "text/json", "json", false);
        this.collection = new mapCollection();
        _.each(data,function(item,i){
            var model = new mapModel({
                id:item.id,
                origin:COLUMNS[item.origen], 
                destination:item.destino,
                key:"",
                rule:"",
                type:TYPE_DATA[item.tipoDato]
            });
            this.collection.add(model);
        },this);
    },
    
    addRow: function(model) {
        var rowView = new mapTableRowView( { model: model } );
        this.$el.find('tbody').append(rowView.render().$el);
    },
    
    initDatatable: function(){
        this.datatable = this.$el.find('#mapTable').DataTable( {
        	"autoWidth"		: false,
            "scrollCollapse": true,
            "paging" 		: false,
            "processing"	: true,
            "destroy"		: true,
            "jQueryUI"		: false,
            "select"		: "single",
            "aoColumnDefs": [{ "orderable": false, "targets": [2] }],
        }); 
    }

});