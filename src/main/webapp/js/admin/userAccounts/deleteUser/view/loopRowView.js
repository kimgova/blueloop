var loopRowView = Backbone.View.extend({
    
    template: '/blueloop/static/js/admin/userAccounts/deleteUser/template/loopRowTemplate.ejs',
        
    constructor : function (options) {
        _.extend(this, options);
    },
    
    render: function () {
        this.$el = $(new EJS({url: this.template }).render(this.model.toJSON()));
        this.setOwners();
        this.setEvents();
        return this;
    },
    
    setOwners: function(){
    	var view = new ownerSelectView({collection:this.userCollection,owner:this.model.get("owner")});
        this.$el.find('.owner-select').html(view.render().$el);
        this.$el.find(".selectpicker").selectpicker();
    },
    
    setEvents: function(){
        this.$el.find(".selectpicker").change(this,this.changeOwner);
    },
    
    changeOwner: function(e) {
    	_.each(e.data.$el.find(".selectpicker option:selected"),function(option,i){
            var value = option.value;
            e.data.model.set("owner",value);
        });
    }

});