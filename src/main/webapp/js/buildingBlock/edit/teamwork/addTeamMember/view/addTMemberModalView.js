var addTMemberModalView = Backbone.View.extend({
    template : '/blueloop/static/js/buildingBlock/edit/teamwork/addTeamMember/template/addTMemberModal.ejs',

    constructor : function (options) {
        _.extend(this, options);
    },
    
    render : function() {
        this.$el = $(new EJS({url:this.template}).render());
        this.setCollection();
        var selectView = new addTMemberSelectView({ model: this, collection: this.collection });
        this.setEvents(selectView);
        
        return this;
    },
    
    setEvents: function(view){
        this.$el.find("#select-container").append(view.render().$el);
        this.$el.find(".selectpicker").selectpicker();
        
        this.$el.find("#addMembers").click(this,this.addUsersToTeam);
        this.$el.find(".closeModal").click(this,this.removeModal);
        this.$el.find(".all").click(this,this.selectAll);
    },
    
    setCollection : function() {
        this.collection = new teamMemberCollection([]);
        _.each(this.retrieveUsersList(), function(item,i){
            if(i == 0){
                this.collection.add(new teamMemberModel({id:0,name:"Select All",value:0}));
            }
                if(!this.membersCollection.findWhere({user_id:item.id})){
                    var model = new teamMemberModel({
                        user_id : item.id,
                        name    : item.name,
                        company : item.company,
                        value   : 'reg_' + i
                    });
                    this.collection.add(model);
                }
            
        },this);
    },

    retrieveUsersList:function(){
        var dataReturned = $.ajax({
            type : 'GET',
            url : '/blueloop/teamwork/getContactsForTeam/',
            data : {id:null},
            contentType : 'application/json; charset=utf-8',
            dataType : 'json',
            async : false,
            success : function(data, textStatus) {
                data = data;
            },
            error : function(httpRequest, textStatus, errorThrown) {
                console.info("status=" + textStatus + " ,error=" + errorThrown);
                toastr.error(json.error.tryAgain);
            }
        });
        return dataReturned.responseJSON;
    },
    
    removeModal : function(e){
        $("#addTMemberModal").remove();
        $("#datatable-modal").focus();
        $("#datatable-modal").css({overflow:"auto"});
    },
    
    addUsersToTeam : function(e) {
        var sendEmail = e.data.$el.find("#checkbox_sendEmail")[0].checked;
        e.data.addCollection = new teamMemberCollection([]);
        _.each(e.data.$el.find(".selectpicker option:selected"),function(option,i){
            var value = option.value;
            if(value != 0){
                var newUser = e.data.collection.findWhere({value:value});
                newUser.set("sendEmail", sendEmail);
                newUser.set("bb_id", e.data.tableView.bb_id);
                e.data.addCollection.add(newUser);
            }
        });
        if( e.data.addCollection.length > 0){
            e.data.saveUser();
        }
    },
    
    selectAll : function(e) {
        e.data.$el.find(".selectpicker").selectpicker("selectAll"); 
    },
    
    saveUser : function() {
        var that = this;
        var models = {models:that.addCollection.models};
        var result= $.ajax({
            type: 'POST',
            url: '/blueloop/teamwork/saveNewMembers/',
            data: JSON.stringify(models),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            async: false,
            success: function(data, textStatus) {
                if(data.teamMemberList){
                    _.each(data.teamMemberList,function(item,i){
                        var newUser = that.collection.findWhere({user_id:item.user_id});
                        newUser.set("id",item.id_teamMember);
                        that.tableView.addNewTeamUser(newUser);
                        that.collection.remove(newUser);
                    });
                    toastr.success(json.teamwork.memberAdded);
                }else{
                    toastr.error(json.bbalerts.errorSaving);
                }
            },
            error: function(httpRequest, textStatus, errorThrown) { 
               console.log("status=" + textStatus + " ,error=" + errorThrown);
               toastr.error(json.bbalerts.errorSaving);
            }
                
        });
    }
});