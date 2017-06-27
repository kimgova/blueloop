var mapModalEditView = Backbone.View.extend({
    
    template: '/blueloop-backend/static/js/buildingBlock/edit/inventory/map/template/mapModalEdit.ejs',
    
    constructor : function (options) {
        _.extend(this, options);
    },

    render: function() {
        this.$el = $(new EJS({url: this.template}).render());

        this.collection.each(this.addRow, this);
        this.setEvents();
        
        return this;
    },
    
    setEvents: function(){
        this.$el.find("#backMapEdit").click(this,this.backMap);
        this.$el.find("#saveMap").click(this,this.saveMap);
        this.$el.find(".selectpicker").selectpicker();
    },
    
    backMap: function(e){
        var mapView = new mapModalView({model:e.data.model});
        mapView.render().$el.modal({backdrop: 'static',keyboard: false});
        mapView.initDatatable();
        e.data.$el.remove();
    },
    
    saveMap: function(e){
        var data = $(e.data.$el).find("form").serializeArray();
        var result = ajaxCall('POST','/blueloop-backend/loadFile/updateFileMapping/', JSON.stringify(data), "text/json", "json", false);
        if(result.text == "success"){
        	toastr.success(json.blueMonitor.succesSave);
        }else{
        	toastr.success(json.blueMonitor.succesSave);
        }
    },
    
    addRow: function(model){
        var rowView = new mapEditFieldsView( { model: model } );
        this.$el.find('#formEdit').append(rowView.render().$el);
    }

});