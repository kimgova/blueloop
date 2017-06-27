var flowBBRowView = Backbone.View.extend({
    
    template: '/blueloop-backend/static/js/admin/userAccounts/deleteUser/template/flowRowTemplate.ejs',
        
    constructor : function (options) {
        _.extend(this, options);
    },
    
    render: function () {
        this.$el = $(new EJS({url: this.template }).render(this.model.toJSON()));
//        this.setTeamUsers();
        this.setOwners();
        this.setEvents();
        return this;
    },
    
    setTeamUsers: function(){
        this.userCollection = new userCollection([]);
        _.each(this.model.get("flowTeam"),function(item,i){
            var user = new userModel({
                id:       item.id,
                name:     item.name
            });
            this.userCollection.push(user);
        },this);
    },
    
    setOwners: function(){
        var view = new ownerSelectView({collection:this.userCollection,owner:this.model.get("responsible")});
        this.$el.find('.owner-select').html(view.render().$el);
        this.$el.find(".selectpicker").selectpicker();
    },
    
    setEvents: function(){
        this.$el.find(".selectpicker").change(this,this.changeOwner);
    },
    
    changeOwner: function(e) {
        _.each(e.data.$el.find(".selectpicker option:selected"),function(option,i){
            var value = option.value;
            e.data.model.set("responsible",value);
        });
    }

});