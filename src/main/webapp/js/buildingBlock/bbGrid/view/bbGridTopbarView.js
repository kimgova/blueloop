var bbGridTopbarView = Backbone.View.extend({
    
	template: '/blueloop/static/js/buildingBlock/bbGrid/template/bbGridTopbarTemplate.ejs',
    
    initialize: function (){
		this.render();
	},
    
    render: function() {
    	this.$el = $(new EJS({url: this.template }).render());
    	this.$el.find('#search-box input').keyup(this,this.search);
    	this.$el.find('#filter-bbs li').click(this,this.filter);
        return this;
    },
    
    search: function(e){
		var letters = $("#search-box input").val();
		$(".selectedFilter").html(e.data.$el.find('#filter-bbs li').first().html());
		bbGrid.filterSearch(letters);
	},
	
	filter: function(e){
		e.preventDefault();
        var elementId = e.target.id;
        $(".selectedFilter").html($(e.target).html());
        bbGrid.filteredCollection(elementId);
	},
	
});