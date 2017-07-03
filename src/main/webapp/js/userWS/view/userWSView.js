var userWSView = Backbone.View.extend({
    
    template: '/blueloop/static/js/userWS/template/userWSViewTemplate.ejs',
    
    initialize: function (){

        this.render();

        this.infoView = new userWSInfoView({containerView:this});
        this.renderUserInfo();
        this.userId  = this.infoView.model.get('id');
        this.current_id = this.infoView.model.get('current_id');

        this.panelView = new userWSPanelView(this.userId,this.current_id);
        this.renderUserPanel();
    },
    
    render: function() {
        this.$el = $(new EJS({url: this.template }).render());
        $('#user-ws-container').append(this.$el);
        return this;
    },
    
    renderUserInfo: function() {
       this.$el.find('#user-ws-info-container').append(this.infoView.render().$el);
    },
    
    updateUserInfo: function(){
        this.$el.find('#user-ws-info-container').html("");
        this.$el.find('#user-ws-info-container').append(this.infoView.render().$el);
    }, 
    
    renderUserPanel: function(userId) {
        
        this.$el.find('#user-ws-panel-container').append(this.panelView.render().$el);
     }
    
    
   
});

$().ready(function() {
    window.userWS = new userWSView();
});