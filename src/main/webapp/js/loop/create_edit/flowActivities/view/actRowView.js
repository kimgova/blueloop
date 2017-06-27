var actRowView = Backbone.View.extend({
    
    template: '/blueloop-backend/static/js/loop/create_edit/flowActivities/template/act_row_template.ejs',
        
    constructor : function (options) {
        _.extend(this, options);
    },
    
    render: function () {
        this.$el = $(new EJS({url: this.template }).render(this.model.toJSON()));
        this.setEvents();
        this.fitFont();
        return this;
    },
    
    setEvents: function(){
        this.$el.find('.md-check').change(this, this.changeState);
    },
    
    changeState: function(e){
        var modelAct = selectedFlowActCollection.getInstance({}).findWhere({
                        id_flow_bb:e.data.model.get("id_flow_bb"),valve:e.data.valve,id_activity:e.data.model.get("id_activity")
                       });
        if(e.data.model.get('checked')!='checked'){
            e.data.model.set({checked: 'checked'});
            if(modelAct){
                modelAct.set({checked: 'checked'});
            }
        }else{
            e.data.model.set({checked: ''});
            if(modelAct){
                modelAct.set({checked: ''});
            }
        }
    },
    
    fitFont: function(){
        if( this.model.get("description").length > 45){
            this.$el.find('.act_des label').css('font-size',"0.8em");
        }
    }
});