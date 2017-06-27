var userWSLoopListView = Backbone.View.extend({
    
    template: '/blueloop-backend/static/js/userWS/template/userWSLoopListViewTemplate.ejs',
    
    initialize: function(userId,current_id){
        _.bindAll(this, 'render', 'arrowRight', 'arrowLeft'); 
        this.userId = userId;
        this.current_id = current_id;
        this.userLoopTw = [];
        this.listLength;
        this.loopsCollection = new userWSElementCollection([]);
        this.getLoopCollection(this.loopsCollection);
        this.loopsCollection.each(this.setUserRolePairs, this);
        this.setUserLoopRoles();
        
        /*Horizontal scroll variables*/
        this.visible = 5; //Set the number of items that will be visible in the list
        this.index = 0; //Starting index
        this.endIndex = ( this.loopsCollection.length / this.visible ) - 1;
    },
  
    render: function() {
        this.$el = $(new EJS({url: this.template }).render());
        var listHeader = "Loops "+ $("#ws-info-first-name").text() +" participates in: "+ this.listLength;
        this.$el.find('#ws-loops-header').text(listHeader);
        
        var arrowRight = this.$el.find('.ws-list-arrow-right');
        arrowRight.click(this, this.arrowRight);
        
        var arrowLeft = this.$el.find('.ws-list-arrow-left');
        arrowLeft.click(this, this.arrowLeft);
        
        this.loopsCollection.each(this.addElementModel, this);
        
        this.setArrows();
        
        return this;
    },
    
    getAllLoops : function(){
        var userId      = this.userId;
        var jsonObject  = new Object();
        jsonObject.userId = userId; 
        
        var dataReturned = $.ajax({
            type: 'GET',
            url: '/blueloop-backend/chain/listLoopsPerfil/',
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
        return dataReturned.responseJSON; 
    },
    
    getLoopCollection : function(collection){
        var response    = this.getAllLoops();
        var loopsList   = response.chainList;
        this.listLength = loopsList.length;
        
        this.addLoopList(collection,loopsList, response.filePath);
    },
    
    addLoopList: function(collection, loopList, filePath){
        _.each(loopList,function(item,i){
            var model = new userWSElementModel({
                id: item.chain.id,
                path:"/blueloop-backend/static/images/home/loop.png",
                name: item.chain.description,
                teamwork: item.chain.teamwork.id,
                allowAccess : item.allowAccess,
                commonChain : item.commonChain,
                ownerName : item.userCreator,
                type:"Loop"
              });
            collection.add(model);
        });
    },

    addElementModel: function(model) {
        var modelView = new userWSElementView( {model: model} );
        this.$el.find('#ws-loops-list').append(modelView.render().$el);
    },
    
    setArrows : function(){
        var arrowRight =  this.$el.find('.ws-list-arrow-right');
        var arrowLeft =  this.$el.find('.ws-list-arrow-left');
        if(this.loopsCollection.length > this.visible){
           arrowRight.removeClass('hidden');
           arrowRight.addClass('visible');
           if(this.index > this.endIndex){
               arrowRight.removeClass('visible');
               arrowRight.addClass('hidden');
           }
           if(this.index > 0){
               arrowLeft.removeClass('hidden');
               arrowLeft.addClass('visible');
           }
           if(this.index == 0){
               arrowLeft.removeClass('visible');
               arrowLeft.addClass('hidden');
           }
        }
    },
    
    arrowRight : function(e){
        
        if(this.index < this.endIndex ){
            this.index++;
            if(this.index >= this.endIndex){
                this.setArrows();
            }
            $('#ws-loops-list div.ws-element').animate({'left':'-=594px'});
        }
       
    },
    
    arrowLeft : function(e){
        if(this.index > 0){
            this.index--;    
            if(this.index == 0){
                this.setArrows();
            }
            $('#ws-loops-list div.ws-element').animate({'left':'+=594px'});
         }
    },
    
    setUserRolePairs : function(model){
        this.userLoopTw.push({"teamwork" : model.attributes.teamwork, "userId" : this.userId});
        
    },
    
    getUserLoopRoles : function(){
        
        var jsonObject = new Object();
        jsonObject.userId = this.userId;
        jsonObject.pairs = JSON.stringify(this.userLoopTw);
        var dataReturned = $.ajax({
            type: 'GET',
            url: '/blueloop-backend/teamwork/getUserTWRoles/',
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
        return dataReturned.responseJSON; 
    },
    
    setUserLoopRoles : function(){
        var rolesList = this.getUserLoopRoles();
        var formattedRole;
        _.each(rolesList,function(item,i){
            this.loopsCollection.find(function(model) {
                if(model.get('teamwork') == item.teamworkId){
                    formattedRole = this.formatRoles(item.role)
                    model.set({role: formattedRole}); 
                };
            }, this);
        }, this);
    },
    
    formatRoles : function(role){
        switch(role){
            case "LOOP_ARCHITECT": 
                return "Architect";
            break;
            case "LOOP_BB_RESPONSIBLE": 
                return "BB Responsible";
            break;
            case "LOOP_INVITED": 
                return "Viewer";
            break;
        }
        
    }
    
});