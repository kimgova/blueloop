var loopElementView = Backbone.View.extend({
    
    template: '/blueloop/static/js/loop/loopGrid/template/loopElementViewTemplate.ejs',

    initialize: function(){
        _.bindAll(this, 'render', 'clicked','showOptions', 'hideOptions', 'archiveLoop', 'removeLoop', 'restoreLoop'); 
        this.listenTo(this.model, 'show', this.show);
        this.listenTo(this.model, 'hide', this.hide);
    },
    
    constructor : function (options) {
		_.extend(this, options);
	},
	
    hide: function(){
      this.$el.addClass('hide')
    },
    
    show: function(){
      this.$el.removeClass('hide')
    },
    
    clicked: function(e){
        e.preventDefault();
        e.data.mainView.panel.refresh(e.data.model);
    },
    
    render: function() {
    	this.initialize();
    	this.$el = $(new EJS({url: this.template }).render(this.model.toJSON()));
    	this.$el.find("#detail-btn").click(this,this.clicked);
    	
    	this.$el.find('#user-options').click(this, this.showOptions);
    	this.$el.find('#mark-transition').mouseleave(this, this.hideOptions);
    	
    	this.$el.find('#archive-loop').click(this, this.archiveLoop);
    	this.$el.find('#restore-loop').click(this, this.restoreLoop);
    	this.$el.find('#remove-loop').click(this, this.removeLoop);
    	
        return this;
    },
     
     showOptions: function(e){
     	this.$el.find('#user-options').css('top', '-16px');
     	this.$el.find('#archive-loop').css('top', '11px');
     	this.$el.find('#restore-loop').css('top', '11px');
     	this.$el.find('#remove-loop').css('top', '11px');
     	this.$el.find('#goto-ws').css('top', '11px');
     },
     
     hideOptions: function(e){
     	this.$el.find('#user-options').css('top', '7px');
     	this.$el.find('#archive-loop').css('top', '-16px');
     	this.$el.find('#restore-loop').css('top', '-16px');
     	this.$el.find('#remove-loop').css('top', '-16px');
     	this.$el.find('#goto-ws').css('top', '-16px');
     },
     
     archiveLoop : function(){
    	 var model = this.model.attributes;
    	 var jsonObject = new Object();
		 jsonObject.id = model.id;
		 
		 bootbox.confirm(json.loop.confirmArchive, function (e) {
			if(e){					
				$.ajax({
	 		        type: 'GET',
	 		        url: '/blueloop/chain/changeState/',
	 		        data: jsonObject,
	 		        contentType: 'application/json; charset=utf-8',
	 		        dataType: 'json',
	 		        async: false,
	 		        success: function(data, textStatus) {
	 		        	data =  data;
	 		        	toastr.success(json.loop.archived);
	 		        	setTimeout(function(){window.location.replace("/blueloop/chain/list")}, 1000);
	 		        },
	 		    	error: function(httpRequest, textStatus, errorThrown) { 
	 		     	   console.log("status=" + textStatus + " ,error=" + errorThrown);
	 		     	   toastr.error(json.error.tryAgain);
	 		     	}
	 		    });
			}
		});
     },
     
     restoreLoop : function(){
    	 var model = this.model.attributes;
    	 var jsonObject = new Object();
		 jsonObject.id = model.id;	
			
		$.ajax({
	        type: 'GET',
	        url: '/blueloop/chain/changeState/',
	        data: jsonObject,
	        contentType: 'application/json; charset=utf-8',
	        dataType: 'json',
	        async: false,
	        success: function(data, textStatus) {
	        	data =  data;
	        	toastr.success(json.loop.restored);
	        	setTimeout(function(){window.location.replace("/blueloop/chain/list")}, 1000);
	        },
	    	error: function(httpRequest, textStatus, errorThrown) { 
	     	   console.log("status=" + textStatus + " ,error=" + errorThrown);
	     	   toastr.error(json.error.tryAgain);
	     	}
	    });
	 },
	 
	 removeLoop : function(){
    	 var model = this.model.attributes;
    	 var jsonObject = new Object();
		 jsonObject.id = model.id;	
		 
		 bootbox.confirm(json.loop.confirmDelete, function (e) {
			if(e){					
				$.ajax({
	 		        type: 'POST',
	 		        url: '/blueloop/chain/delete/'+ jsonObject.id,
	 		        data: jsonObject,
	 		        contentType: 'application/json; charset=utf-8',
	 		        dataType: 'json',
	 		        async: false,
	 		        success: function(data, textStatus) {
	 		        	data =  data;
	 		        	toastr.success(json.loop.deleted);
	 		        	setTimeout(function(){window.location.replace("/blueloop/chain/list")}, 1000);
	 		        },
	 		    	error: function(httpRequest, textStatus, errorThrown) { 
	 		     	   console.log("status=" + textStatus + " ,error=" + errorThrown);
	 		     	   toastr.error(json.error.tryAgain);
	 		     	}
	 		    });
			}
		});
	 }
});