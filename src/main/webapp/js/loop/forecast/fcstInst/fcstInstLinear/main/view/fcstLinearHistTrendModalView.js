var historicalTrendModalView = Backbone.View.extend({
    
    template: '/blueloop/static/js/loop/forecast/fcstInst/fcstInstLinear/main/template/fcstLinearHistTrendModal.ejs',

    render: function() {
    	this.$el = $(new EJS({url: this.template }).render({data:'data graph'}));
    	this.data = this.setData(this.getHistoricalData());

    	var that=this;
    	this.$el.on('shown.bs.modal', function (e) {    	  
			that.setGraph(that.data);
    	});
        return this;
    },
    
    getHistoricalData: function(){
    	console.log(this.planningId)
    	var dataReturned = $.ajax({
	        type: 'GET',
	        url: '/blueloop/fcstLinearPlan/getHistoricalData/',
	        data: {planningId:this.planningId},
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
    
    setData: function(salesData){
    	var data = [];
    	$.each(salesData, function(i, item){
    		data.push({period: item.year + "-"+(item.month + 1), sales:item.sales});
		})
		return data;
    },
    
    setGraph: function(data){
    	Morris.Area({
            element: 'hero-area',
            data:data,
            xkey: 'period',
            ykeys: ['sales'],
            labels: ['Sales'],
            hideHover: 'auto',
            lineWidth: 1,
            pointSize: 5,
            lineColors: ['#a9d86e'],
            fillOpacity: 0.5,
            smooth: true,
            xLabels:"month",
            xLabelFormat: function (x) {
                      var IndexToMonth = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
                      var month = IndexToMonth[ x.getMonth() ];
                      var year = x.getFullYear();
                      return year + ' ' + month;
            },
            dateFormat: function (x) {
                      var IndexToMonth = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
                      var month = IndexToMonth[ new Date(x).getMonth() ];
                      var year = new Date(x).getFullYear();
                      return year + ' ' + month;
            },
          });
    }


});