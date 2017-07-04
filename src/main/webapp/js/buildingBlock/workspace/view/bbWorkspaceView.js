var bbWorkspaceView = Backbone.View.extend({
    
	template: '/blueloop/static/js/buildingBlock/workspace/template/bbWorkspaceViewTemplate.ejs',
	tabViews: {},
	
    initialize: function (){
    	 _.bindAll(this, 'render', 'openTab'); 
    	this.bbId = this.getBBId();
    	this.bb = this.getBB(this.bbId);
		this.render();
//		this.contentView = new bbWSGeneralView(this.bb);
		this.contentView = new bbWSConnectionsView(this.bb);
		this.renderContentView();
	},
	
    render: function() {
    	this.$el = $(new EJS({url: this.template }).render());
    	$('#bb-workspace').append(this.$el);
    	
    	this.$el.find('.tab').click(this, this.openTab);
        return this;
    },
    
    renderContentView: function() {
       this.$el.find('#bb-ws-container').append(this.contentView.render().$el);
    },
    
    openTab : function(e){
    	var el = $(e.currentTarget); 	
    	$("#bb-ws-container").children().detach();
        if(!this.tabViews[el.attr('id')]) {
            this.tabViews[el.attr('id')] = this.createTabViewForEl(el);
        }
        
        this.$el.find('#bb-ws-container').append(this.tabViews[el.attr('id')].render().$el);
    },
    
    createTabViewForEl: function (el) {
        var tab;
        switch(el.attr('id')) {
        	case "general-tab":
        		tab = new bbWSGeneralView(this.bb);
        		break;
            case "connections-tab":
                tab = new bbWSConnectionsView(this.bb);
                break;
        }
        return tab;
    },
    
    getBBId : function(){
    	var url = window.location.pathname;
    	var id = url.substr(url.lastIndexOf('/')+1);
    	return id;
    },
    
    getBB : function(idBB){
    	var jsonObject = new Object();
		jsonObject.id=idBB;
		
		var dataReturned = $.ajax({
	        type: 'GET',
	        url: '/blueloop/buildingBlock/getBuildingBlock/',
	        data: jsonObject,
	        contentType: 'application/json; charset=utf-8',
	        dataType: 'json',
	        async: false,
	        success: function(data, textStatus) {
	        	data =  data;
	        },
	    	error: function(httpRequest, textStatus, errorThrown) { 
	     	   console.log("status=" + textStatus + " ,error=" + errorThrown);
	     	   toastr.error(json.error.tryAgain);
	     	}
	    });
		//console.log(dataReturned.responseJSON);
		return dataReturned.responseJSON; 
    }
    
    
});

$().ready(function() {
	window.bbWS = new bbWorkspaceView();
});