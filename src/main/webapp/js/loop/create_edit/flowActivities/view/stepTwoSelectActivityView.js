var stepTwoSelectActivityView = Backbone.View.extend({
    
    template: '/blueloop/static/js/loop/create_edit/flowActivities/template/step_two_template.ejs',
        
    constructor : function (options) {
        _.extend(this, options);
    },
    
    render: function () {
        this.$el = $(new EJS({url: this.template }).render());
        this.getActivitiesList();
        this.collection.each(this.addRow, this);
        return this;
    },
    
    getActivitiesList: function(){
        var result = ajaxCall('GET', '/blueloop/activityBuildingBlock/getAllFlowBBActivities/', {idBB:this.model.get("id"),valve_id:this.valve}, "text/json", "json", false);
        _.each(result,function(item,i){
            if(!this.collection.findWhere({id_activity:item.id})){
                var activity = new flowActivityModel({
                    id_activity : item.id,
                    id_flow_bb  : this.model.get("id"),
                    description : item.description,
                    imgURI      : item.imgURI,
                    haveOrders  : item.haveOrders
                });
                
                var modelAct = selectedFlowActCollection.getInstance({}).findWhere({id_flow_bb:this.model.get("id"),valve:this.valve,id_activity:item.id});
                if(modelAct){
                    activity.set("leadTime",modelAct.get("leadTime"));
                    activity.set("leadTimeType",modelAct.get("leadTimeType"));
                    activity.set("responsible",modelAct.get("responsible"));
                    activity.set("checked","checked");
                }
                
                this.collection.push(activity);
            }
        },this);
    },
    
    addRow: function(model) {
        var rowView = new actRowView( { model: model, valve:this.valve } );
        this.$el.find('#row_activities').append(rowView.render().$el);
    }
});