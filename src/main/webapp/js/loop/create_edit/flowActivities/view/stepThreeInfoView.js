var stepThreeInfoView = Backbone.View.extend({
    
    template: '/blueloop/static/js/loop/create_edit/flowActivities/template/step_three_template.ejs',
        
    constructor : function (options) {
        _.extend(this, options);
    },
    
    render: function () {
        this.$el = $(new EJS({url: this.template }).render());
        this.getTeamMembers();
        
        _.each(this.collectionModels,function(item,i){
            this.addRow(item);
        },this);
        
        return this;
    },
    
    getTeamMembers: function(){
        var data    = new Object();
        data.idBB   = this.model.get("id");
        this.team_members = ajaxCall('GET','/blueloop/teamwork/getMembersOfFlowBB/', data, "text/json", "json", false);
    },
    
    addRow: function(model) {
        var rowView = new actInfoRowView({ model: model, team_members:this.team_members});
        this.$el.find('#row_info_activities').append(rowView.render().$el);
    }
});