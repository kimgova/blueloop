var valveFlowBBView = Backbone.View.extend({
    
    template: '/blueloop/static/js/loop/create_edit/valve/template/valveFlowBBRow.ejs',
    
    constructor : function (options) {
        _.extend(this, options);
    },

    render: function() {
        this.$el = $(new EJS({url: this.template }).render(this.model.toJSON()));
        this.setEvents();
        return this;
    },
    
    setEvents: function(){
        this.$el.find("#deleteFlowBB").click(this,this.deleteFlowBB);
        this.$el.find("#showFlowBB").click(this,this.showFlowBB);
        this.$el.find("#bra_"+this.model.get("id_flow_bb") + "_" + this.model.get("id_activity")).click(this,this.changeMCState);
    },
    
    changeMCState: function(e){
        if(e.currentTarget.checked){
            e.data.$el.find("#bmc_"+e.data.model.get("id_flow_bb") + "_" + e.data.model.get("id_activity")).prop('checked', true);
            e.data.$el.find("#bmc_"+e.data.model.get("id_flow_bb") + "_" + e.data.model.get("id_activity")).prop('disabled', true);
        }else{
            e.data.$el.find("#bmc_"+e.data.model.get("id_flow_bb") + "_" + e.data.model.get("id_activity")).prop('checked', false);
            e.data.$el.find("#bmc_"+e.data.model.get("id_flow_bb") + "_" + e.data.model.get("id_activity")).prop('disabled', false);
        }
    },
    
    showFlowBB: function(e){
        e.preventDefault();
        FormController.openFlowBBForm(e.data.model);
    },
    
    deleteFlowBB: function(e){
        if(e.data.model.get('haveOrders')){
            toastr.error('This Flow Building Blocks has active orders, cannot be deleted')
        }else{
        	bootbox.confirm(json.activity.confirmDel +' "'+ e.data.model.get('description') + '" ?', function (r) {
                if(r){
                    e.data.$el.remove();
                    var model = selectedFlowActCollection.getInstance({}).findWhere(e.data.model);
                    if(model){
                        selectedFlowActCollection.getInstance({}).remove(model);
                        toastr.success(json.bb.deleted);
                    }
                   
                }
            });
        }
    }
    
});