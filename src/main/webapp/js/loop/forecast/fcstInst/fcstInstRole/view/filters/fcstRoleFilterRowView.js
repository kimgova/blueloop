var forecastRoleFilterRowView = Backbone.View.extend({
    
    template: '/blueloop-backend/static/js/loop/forecast/fcstInst/fcstInstRole/template/filters/rowRoleFiltersTemplate.ejs',
        
    render: function () {    	
        this.$el = $(new EJS({url: this.template }).render(this.model.attributes));
        this.setEvents();
        
        return this;
    },
	
    setEvents: function(){ 
    	var that = this;
        this.$el.find(".statusFilter").on('ifChecked', function(e){
        	var idFRSF = e.target.getAttribute('idfrsf');
        	var idFilter = e.target.getAttribute('filter');
        	var status = true;
        	var idFRSku = that.model.get('idFRSku');
        	
        	var dataSKuFilter = JSON.parse(that.editSkuFilter(idFRSF,status,idFRSku,idFilter));
	    	that.updateModel(that.model,dataSKuFilter,status,idFilter);
        	e.target.setAttribute('idfrsf',dataSKuFilter);

        	var inputCheckbox = $("#display").find("input[idFRSku='"+idFRSku+"'][filter='"+idFilter+"']")
        	inputCheckbox.attr('idfrsf',dataSKuFilter);
        	inputCheckbox.parent().addClass("checked");
        });
        
        this.$el.find(".statusFilter").on('ifUnchecked', function(e){
        	var idFRSF = e.target.getAttribute('idfrsf');
	    	var idFilter = e.target.getAttribute('filter');
	    	var status = false;
	    	var idFRSku = that.model.get('idFRSku');
	    	
	    	var dataSKuFilter = JSON.parse(that.editSkuFilter(idFRSF,status,idFRSku,idFilter));
	    	that.updateModel(that.model,dataSKuFilter,status,idFilter);
	    	e.target.setAttribute('idfrsf',dataSKuFilter);
	    	
        	var inputCheckbox = $("#display").find("input[idFRSku='"+idFRSku+"'][filter='"+idFilter+"']")
	    	inputCheckbox.attr('idfrsf',dataSKuFilter);
        	inputCheckbox.parent().removeClass("checked");
		});
    },
    
    updateModel: function(model, idSKuFilter, status, idFilter){       	
    	$.each(model.get('filterList'), function(i, filterSku){
   			if(filterSku.filter.id == idFilter){
   				filterSku.idFRSF = idSKuFilter[0];
   				filterSku.status = status;
   			}
   		});
    },
		    
	editSkuFilter: function(idFRSF,status,idFRSku,idFilter){
	  	var skuFilter = {idFRSF:idFRSF,status:status,idFRSku:idFRSku,idFilter:idFilter};
	  	var dataReturned = $.ajax({
	       type: 'POST',
	       url: '/blueloop-backend/fcstRoleFilter/editForecastRoleSkuFilter/',
	       data: JSON.stringify(skuFilter),
	       contentType: 'application/json; charset=utf-8',
	       dataType: 'json',
	       async: false,
	       success: function(data, textStatus) {
	    	   data =  data;
	    	   toastr.success(json.forecast.fcstInstFilterRoleChecked);
	       },
		   error: function(httpRequest, textStatus, errorThrown) { 
		      console.log("status=" + textStatus + " ,error=" + errorThrown);
		      toastr.error(json.error.tryAgain);
		   }
		});
	    return dataReturned.responseText;
	},

});