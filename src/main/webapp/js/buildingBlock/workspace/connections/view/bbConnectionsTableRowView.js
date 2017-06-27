var bbConnectionsTableRowView = Backbone.View.extend({
    
    template: '/blueloop-backend/static/js/buildingBlock/workspace/connections/template/bbConnectionsTableRowTemplate.ejs',
    
    
    initialize: function(){
        _.bindAll(this, 'openDropdown', 'closeDropdown', 'acceptReceivedRequest', 'rejectReceivedRequest', 'removeConnection', 'refreshState'); 
        this.model.bind("change:status", this.refreshState);
    },
    
     render: function() {
    	this.$el = $(new EJS({url: this.template }).render(this.model.toJSON()));
    	this.$el.find('.dropdown-closed').click(this, this.openDropdown);
    	this.setButtonActions();
        return this;
    },
    
    openDropdown : function(){
    	this.$el.find('.dropdown-toggle').removeClass('dropdown-closed');
    	this.$el.find('.dropdown-toggle').addClass('dropdown-open');
    	var idBB = this.model.get('myBbId');
    	var idConnection = this.model.get('connId');
    	if(!this.permissionsView) {
    		this.permissionsView = new bbConnectionsPermissionsDropdownView(idBB, idConnection);
        }
    	this.$el.find('.ws-dropdown').remove();
    	this.$el.find('#ws-permissions-dropdown').append(this.permissionsView.render().$el);
    	this.$el.find('.ws-dropdown-menu').removeClass('dropdown-invisible');
    	this.$el.find('.ws-dropdown-menu').addClass('dropdown-visible');
    	this.$el.find('.dropdown-open').unbind("click");
    	this.$el.find('.dropdown-open').click(this, this.closeDropdown);
    },
    
    closeDropdown : function(){
    	this.$el.find('.ws-dropdown-menu').removeClass('dropdown-visible');
    	this.$el.find('.ws-dropdown-menu').addClass('dropdown-invisible');
    	this.$el.find('.dropdown-toggle').removeClass('dropdown-open');
    	this.$el.find('.dropdown-toggle').addClass('dropdown-closed');
    	this.$el.find('.dropdown-closed').unbind("click");
    	this.$el.find('.dropdown-closed').click(this, this.openDropdown);
    },
    
    setButtonActions : function(){
    	
    	if(this.model.get('category') == "Received" && this.model.get('status') == "Pending"){
    		//accept/reject request
    		var btnAccept = this.$el.find('.conn-actions a.conn-action-1')
    		var btnReject = this.$el.find('.conn-actions a.conn-action-2')
    		btnAccept.addClass('conn-action-accept');
    		btnReject.addClass('conn-action-reject');
    		
    		this.$el.find('.conn-actions a.conn-action-1 i').addClass('icon-check');
    		this.$el.find('.conn-actions a.conn-action-2 i').addClass('icon-close');
    		
    		btnAccept.click(this, this.acceptReceivedRequest);
    		btnReject.click(this, this.rejectReceivedRequest);
    	}else if(this.model.get('status') == "Approved"){
    		//go to bb, delete bb
    		var btnGoTo = this.$el.find('.conn-actions a.conn-action-1');
    		var btnRemove = this.$el.find('.conn-actions a.conn-action-2');
    		btnGoTo.attr('href', '/blueloop-backend/buildingBlock/workspace/' + this.model.get('connBbId'));
    		btnGoTo.addClass('conn-action-goto');
    		btnRemove.addClass('conn-action-remove');
    		
    		this.$el.find('.conn-actions a.conn-action-1 i').addClass('icon-arrow-right-circle');
    		this.$el.find('.conn-actions a.conn-action-2 i').addClass('icon-trash');
    		
    		btnRemove.click(this, this.removeConnection);
    	}else if(this.model.get('category') == "Sent" && this.model.get('status') == "Pending"){
    		var btnGoTo = this.$el.find('.conn-actions a.conn-action-1');
    		var btnRemove = this.$el.find('.conn-actions a.conn-action-2');
    		this.$el.find('.conn-actions a.conn-action-1 i').addClass('icon-arrow-right-circle');
    		this.$el.find('.conn-actions a.conn-action-1 i').css('visibility', 'hidden');
    		this.$el.find('.conn-actions a.conn-action-2 i').addClass('icon-trash');
    		
    		btnRemove.click(this, this.removeConnection);
    	}
    },
    
    acceptReceivedRequest : function(){
    	var data = {connId: this.model.get('connId'), state: 1}
    	var dataAjax = ajaxCall('POST', '/blueloop-backend/buildingBlock/answerReceivedRequest/', JSON.stringify(data), 'application/json; charset=utf-8', "json", false);
    	this.model.set({status: "Aproved"});
    	toastr.success(json.bb.connectionSave);
    },
    
    rejectReceivedRequest : function(){
    	var data = {connId: this.model.get('connId'), state: 2}
    	var dataAjax = ajaxCall('POST', '/blueloop-backend/buildingBlock/answerReceivedRequest/', JSON.stringify(data), 'application/json; charset=utf-8', "json", false);
    	this.model.set({status: "Declined"});
    	toastr.success(json.bb.connectionSave);
    },
    
    removeConnection : function(){
    	var dat = {bbOutId:this.model.get('bbOut'), bbInId:this.model.get('bbIn'), instanceId:this.model.get('connId'), state:3}
    	var data = ajaxCall('POST', '/blueloop-backend/buildingBlock/modifyconnectBb', JSON.stringify(dat), "text/json", "json", false);	
    	this.model.set({status: "Canceled"});
    	toastr.success(json.connection.removed);
    },
    
    refreshState : function(){
    	this.$el.find('#status').text(this.model.get("status"));
    	this.setButtonActions();
    }
    
    
});