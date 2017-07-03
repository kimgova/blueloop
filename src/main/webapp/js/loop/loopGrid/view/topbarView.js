var topbarView = Backbone.View.extend({
    
	template: '/blueloop/static/js/loop/loopGrid/template/topbarTemplate.ejs',
	
	constructor : function (options) {
		_.extend(this, options);
	},
    
    initialize: function (){
		this.render();
	},
    
    render: function() {
    	this.$el = $(new EJS({url: this.template }).render());
    	this.$el.find('#search-box input').keyup(this,this.search);
    	this.$el.find('#filter-loops li').click(this,this.filter);
        return this;
    },
    
    search: function(e){
		var letters = $("#search-box input").val();
		$(".selectedFilter").html(e.data.$el.find('#filter-loops li').first().html());
		e.data.mainView.loopGrid.filterSearch(letters);
	},
	
	filter: function(e){
		e.preventDefault();
        var elementId = e.target.id;
        $(".selectedFilter").html($(e.target).html());
        e.data.mainView.loopGrid.filteredCollection(elementId);
	}
});