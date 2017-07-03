var addTMemberModalView = Backbone.View.extend({
    template : '/blueloop/static/js/loop/create_edit/teamwork/addTeamMember/template/addTMemberModal.ejs',

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
        if(addTMemberCollection.getInstance({}).size() > 0 ){
            this.collection = addTMemberCollection.getInstance({});
        }else{
            this.collection = addTMemberCollection.getInstance({clean:true});
            _.each(this.retrieveUsersList(), function(item,i){
                if(i == 0){
                    var model = new addTMemberModel({
                        id    : 0,
                        name  : "Select All",
                    });
                    this.collection.add(model);
                }
                if(!this.teamModel.model.members.findWhere({idUser:item.id})){
                    var model = new addTMemberModel({
                        id    : item.id,
                        name  : item.name,
                        company : item.company
                    });
                    this.collection.add(model);
                }
            },this);
        }
        
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
        _.each(e.data.$el.find(".selectpicker option:selected"),function(option,i){
            if(parseInt(option.value) != 0){
                var newUser = addTMemberCollection.getInstance({}).findWhere({id:parseInt(option.value)});
                e.data.teamModel.addNewInvitedUser(newUser.get("id"), newUser.get("name"), newUser.get("company"), sendEmail); 
                addTMemberCollection.getInstance({}).remove({id:option.value});
            }
        });
        e.data.teamModel.resetDatatable();
        toastr.success(json.teamwork.memberAdded);
        e.data.removeModal();
    },
    
    selectAll : function(e) {
        e.data.$el.find(".selectpicker").selectpicker("selectAll"); 
    }
});