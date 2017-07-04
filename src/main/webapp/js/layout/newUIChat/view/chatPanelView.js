var chatPanelView = Backbone.View.extend({
    
     template: '/blueloop/static/js/layout/newUIChat/template/chatPanelTemplate.ejs',
     el : $('#chat-panel-container'),
    
     initialize: function (){
            _.bindAll(this, 'render', 'closeChatPanel', 'newGroupChat', 'newLoopChat');
            this.singleChatsCollection = new singleChatCollection([]);
            this.groupChatsCollection = new groupChatCollection([]);
            
            this.groupChats = new groupChatCollection([]);
            this.loopChats = new groupChatCollection([]);
            this.bbChats = new groupChatCollection([]);
            
        
            this.getAllChatsCollection();
            this.groupChatsCollection.each(this.divideGroupChats, this);
            this.render();
            
            this.setNewChatButtonAction();
      },
      
      render: function() {
          var panel = $(new EJS({url: this.template }).render());
           $(this.el).append(panel);
           this.$el.find('#close-chat').click(this,this.closeChatPanel);
           
          this.singleChatsCollection.each(this.addSingleChatModel, this);
          //this.groupChatsCollection.each(this.addGroupChatModel, this);
          this.renderChatCategories();
          
          return this;
      },
      
      divideGroupChats : function(model) {
           var chatType = model.attributes.type;
           if(chatType == 0){//group chat
               this.groupChats.add(model);
           }else if(chatType == 1){ //loop chat
               this.loopChats.add(model);
           }else if(chatType == 3){ //bb chat
               this.bbChats.add(model);
           }
           
       },
       
       renderChatCategories : function(){

           this.groupCategoryView = new chatCategoryView( this.groupChats, "Group");
           //if(this.groupChats.length != 0){
               this.$el.find('#category-container').prepend(this.groupCategoryView.render().$el);
           //}

           this.loopCategoryView = new chatCategoryView( this.loopChats, "Loop" );
           //if(this.loopChats.length != 0){
               this.$el.find('#category-container').prepend(this.loopCategoryView.render().$el);
          // }

           this.bbCategoryView = new chatCategoryView( this.bbChats, "Building Block" );
          // if(this.bbChats.length != 0){
               this.$el.find('#category-container').prepend(this.bbCategoryView.render().$el);
          // }
       },
      
      openChatPanel : function(){
          this.$el.find('#chat-panel').addClass('is-visible');
      },
      
      closeChatPanel: function(e){
          e.preventDefault();
          this.$el.find('#chat-panel').removeClass('is-visible');
      },
      
      setNewChatButtonAction : function(){
        var currentPath = location.pathname;
        var chainId = currentPath.substr(currentPath.lastIndexOf('/') + 1);
        var pathRegex = /chain\/(execution|edit)/;
        var isInLoopSection = pathRegex.test(currentPath);
        if(isInLoopSection){
            this.$el.find('#new-conversation').html('<i>+</i> New Loop Chat');
            this.$el.find('#new-conversation').click(this, this.newLoopChat(chainId));
        }else{
            this.$el.find('#new-conversation').click(this, this.newGroupChat);
        }
        
      },
      
      newGroupChat : function(e){
          e.preventDefault();
          chat.showChatGroupDialog();
      },
      
      newLoopChat : function(chainId){
          return function() {
              chainId = parseInt(chainId);
              chat.showLoopChatGroupDialog(chainId);
         };
      },
      
      getAllChatsCollection: function(){
            var response = this.getUserChats();
            var filePath = response.filePath;
            var groupChats = response.chats; 
            var singleChats = response.listUsers;
            
            /*chanchada un toque*/
            _.each(singleChats,function(item,i){
                var model = new singleChatModel({    
                      userId: item.id,
                        firstName: item.firstName,
                        lastName: item.lastName ,
                        channel: "",
                        type: 2,
                        path: filePath + "/" +  item.username + "/user/profile.png"
                  });
                this.singleChatsCollection.add(model);
            },this);
            
            _.each(groupChats,function(item,i){
                var chain_id;
                var bb_id;
                var path;
                if(item.instanceChat.type == 0){
                    path = "/blueloop/static/images/group.png";
                }else if(item.instanceChat.type==1){
                    chain_id = item.instanceChat.chain.id;
                    bb_id = null;
                    path = "/blueloop/static/images/home/loop.png";
                }else if(item.instanceChat.type==3){
                    bb_id = item.instanceChat.bb.id;
                    chain_id=null;
                    path = response.pathAssets + '/' + item.bbImgRoute;
                }
                var model = new groupChatModel({    
                      id: item.instanceChat.id,
                        chatName: item.instanceChat.name,
                        channel: item.instanceChat.channel,
                        type: item.instanceChat.type,
                        chain_id: chain_id,
                        bb_id: bb_id,
                        path: path
                  });
                this.groupChatsCollection.add(model);
            },this);
       },
      
      getUserChats : function(){
          var dataReturned = $.ajax({
                type: 'GET',
                url: '/blueloop/chat/getUserChats/',
                data: new Object(),
                contentType: "text/json",
                dataType: "json",
                async: false, //was true
                success: function(data) {
                    data = data;
                },
                error: function(httpRequest, textStatus, errorThrown) { 
                    console.log("status=" + textStatus + " ,error=" + errorThrown);
                 }
            });
          return dataReturned.responseJSON;
      },
      
      addSingleChatModel: function(model) {
           var modelView = new singleChatView( {model: model} );
           this.$el.find('#user-chats .chats-container').append(modelView.render().$el);
      },
       
      addGroupChatModel: function(model) {
           var modelView = new groupChatView( {model: model} );
           var chatType = model.attributes.type;
           if(chatType == 0){//group chat
               this.$el.find('#group-chats').removeClass('empty-category');
               this.$el.find('#group-chats .chats-container').append(modelView.render().$el);
           }else if(chatType == 1){ //loop chat
               this.$el.find('#loop-chats').removeClass('empty-category');
               this.$el.find('#loop-chats .chats-container').append(modelView.render().$el);
           }else if(chatType == 3){ //bb chat
               this.$el.find('#bb-chats').removeClass('empty-category');
               this.$el.find('#bb-chats .chats-container').append(modelView.render().$el);
           }
           
       },
       
       changeStatusColor : function(userId, status){
           this.singleChatsCollection.find(function(model) {
                if(model.get('userId') == userId){
                    model.set({status: status}); 
                }; 
            });
        },
        
       setSingleChatChannel : function(userId, channel, chatId){
            this.singleChatsCollection.find(function(model) {
                if(model.get('userId') == userId){
                    model.set({channel: channel}); 
                    model.set({chatId: chatId}); 
                }; 
            });
        },
        
        refreshName : function(chatId, name, chatType){
            switch(chatType){
              case "newGroupChat":
                  this.groupCategoryView.refreshName(chatId, name);
                  break;
              case "newLoopGroupChat":
                  this.loopCategoryView.refreshName(chatId, name);
                  break;
              case "newBBGroupChat":
                  this.bbCategoryView.refreshName(chatId, name);
                  break;
              }
        },
        
        addMessageCount : function (id, type){
            if(type == 2){
                this.singleChatsCollection.find(function(model) {
                    if(model.get('userId') == id && model.get('state') != 1){
                        var count = model.get('count') + 1;
                        model.set({count: count}); 
                    }; 
                });
            }else{
                this.groupChatsCollection.find(function(model) {
                    if(model.get('id') == id){
                        var count = model.get('count') + 1;
                        model.set({count: count}); 
                    }; 
                });
            }
            
            this.unreadMessagesCount();
        },
        
        unreadMessagesCount : function(){
            var msgCount = 0;
            this.singleChatsCollection.each(function(model) {
                msgCount += model.get('count');
            }, this)
            
            this.groupChatsCollection.each(function(model) {
                msgCount += model.get('count');
            }, this)
            
            headView.updateMessagesCount(msgCount);
            
        },
        
        newMessageReceived : function(m, env, ch, id, type){
            this.addMessageCount(id, type);
            var mDate = new Date(m.message.time);
            document.getElementById("MessageAudioChat").play();
            
            _.each(chat.listChatRoom,function(chatWdgt,i){
                if(chatWdgt.model.get("channel") == ch){
                    chatWdgt.putMessages([m]);
                }
            });
        },
        
       addNewGroupChat : function(item){
           var model = new groupChatModel({    
                  id: item.id,
                    chatName: item.name,
                    channel: item.channel,
                    type: item.type,
                    chain_id: null,
                    bb_id: null,
                    path: "/blueloop/static/images/group.png"
            });
           this.groupCategoryView.addChatModel(model);
//           this.groupChatsCollection.add(model);
//           this.addGroupChatModel(model);
       },
       
       addNewLoopChat : function(item){
           var model = new groupChatModel({    
                  id: item.instanceChat.id,
                    chatName: item.instanceChat.name,
                    channel: item.instanceChat.channel,
                    type: item.instanceChat.type,
                    chain_id: item.instanceChat.chain.id,
                    bb_id: null,
                  path: "/blueloop/static/images/home/loop.png"
            });
           this.loopCategoryView.addChatModel(model);
          /* this.groupChatsCollection.add(model);
           this.addGroupChatModel(model);*/
       },
       
       addNewBBChat : function(item){
           var model = new groupChatModel({    
                  id: item.instanceChat.id,
                    chatName: item.instanceChat.name,
                    channel: item.instanceChat.channel,
                    type: item.instanceChat.type,
                    chain_id: null,
                    bb_id: item.instanceChat.bb.id,
                    path:item.bbImgRoute
            });
           this.bbCategoryView.addChatModel(model)
//           this.groupChatsCollection.add(model);
//           this.addGroupChatModel(model);
       },
       
      removeChat : function(chatId, chatType){
          switch(chatType){
          case 0:
              this.groupCategoryView.removeChat(chatId);
              break;
          case 1:
              this.loopCategoryView.removeChat(chatId);
              break;
          case 3:
              this.bbCategoryView.removeChat(chatId);
              break;
          }
      },
      
      setChatState : function (chatId, state){
          this.singleChatsCollection.find(function(model) {
                if(model.get('chatId') == chatId){
                     model.set({state : state});
                }; 
          });
      }

});

//$().ready(function() {
//    window.chatView = new chatPanelView();
//});
