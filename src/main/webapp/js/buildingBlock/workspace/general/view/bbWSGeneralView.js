var bbWSGeneralView = Backbone.View.extend({
    
	template: '/blueloop/static/js/buildingBlock/workspace/general/template/bbWSGeneralViewTemplate.ejs',
	leftPanelTemplate: '/blueloop/static/js/buildingBlock/workspace/general/template/bbGeneralLeftPanelTemplate.ejs',
	
    initialize: function (bb){
    	this.bb = bb;
	},
	
    render: function() {
    	this.$el = $(new EJS({url: this.template }).render());
    	this.renderLeftPanel();
        return this;
    },
    
    renderLeftPanel: function() {
    	var model = this.getBBModel();
    	this.leftPanel = $(new EJS({url: this.leftPanelTemplate }).render(model.toJSON()));
        this.$el.find('#bb-ws-info-container').append(this.leftPanel);
     },
    
    getBBModel: function(){
    	var bb = this.bb;
    	var model = new bbGeneralLeftPanelModel({	
    		  id: bb.bb.id,
    	      name: bb.bb.name,
    	      creator: bb.creator,
    	      responsible: bb.owner,
    	      company: bb.bb.companyName,
    	      email: bb.bb.emailAddress,
    	      areaCode: bb.bb.phoneNumberAreaCode,
    	      phone: bb.bb.phoneNumber,
    	      path: bb.filePath + bb.bb.fileName,
    	      loops : bb.bb.chainBbs.length,
    	      lastUpdated: "Fake 23, 2015"
    		});
    	return model;
    }
    
   
});