var cbbSequenceListView = Backbone.View.extend({
    
    template: '/blueloop-backend/static/js/loop/execution/sequence/cbbSequence/template/cbbSequenceList.ejs',
    
    constructor : function (options) {
        _.extend(this, options);
    },

    render: function() {
        this.$el = $(new EJS({url: this.template}).render(this.model.toJSON()));
        this.setEvents();
        return this;
    },
    
    setEvents: function(){
        this.$el.find(".removeOfSeq").click(this,this.removeOfSequence);
    },
    
    removeOfSequence: function(e){
        e.data.cbbCollection.unshift(e.data.model);
        e.data.seqCollection.pop(e.data.model);
        
        if(e.data.seqCollection.length != 0){
        	e.data.tabView.setListCBBToShow(e.data.seqCollection.at(e.data.seqCollection.length - 1).get("idFormJSON"));
        }else{
        	e.data.tabView.setListCBBToShow(false);
        }
        
        $(e.currentTarget).parents('li').remove();
        
        _.each(e.data.viewItems, function(item,i){
            if(item.model.get("id") == e.data.model.get("id")){
                e.data.viewItems.splice(i, 1);
                return false;
            }
        });
        _.each(e.data.viewItems, function(item,i){
            item.model.set('step', item.$el.index() + 1);
        });
        
        var listView = new cbbListView({
            model : e.data.model, 
            seqCollection:e.data.seqCollection, 
            cbbCollection:e.data.cbbCollection,
            viewItems:e.data.viewItems,
            tabView:e.data.tabView
        });
        e.data.tabView.viewCBBItems.push(listView);
        
        $('#sortableBB').prepend(listView.render().$el);
        e.data.tabView.showCBBList();
        e.data.tabView.hideShowSequenceBtns();
        SequenceExitModel.getInstance({}).set('cbbPendingChanges',true);
        
    },
    
    hideButton: function(){
    	this.$el.find("button").hide();
    },
    
    showButton: function(){
    	this.$el.find("button").show();
    }

});