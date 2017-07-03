var NoSequencesView = Backbone.View.extend({
	
	template: '/blueloop/static/js/loop/execution/sequence/main/template/NoSequencesContent.ejs',
	
	constructor : function (options) {
		_.extend(this, options);
	},

	render: function() {
		this.$el = $(new EJS({url: this.template}).render());
		this.setEvents();
		return this;
	},
	
	setEvents: function(){
		this.$el.find("#GoToAddSeqBtn").click(this,this.goToAddSeqBtn);
	},
	
	goToAddSeqBtn: function(e){
		var newItemView = new SequenceNewItemView({idLoop:e.data.idLoop});
    	$('#seqList').append(newItemView.render().$el);
	},
});