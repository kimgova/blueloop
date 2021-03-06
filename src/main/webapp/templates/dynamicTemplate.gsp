<div class="dynamicForm">
		<input class="form-control" type="hidden" name="id" id="id" value="${id}"/>
		<input class="form-control" type="hidden" name="type" id="type" value="${type}"/>
		<input class="form-control" type="hidden" name="fileName" id="fileName" value="${fileName}"/>
		<input class="form-control" type="hidden" name="fileNameSelect" id="fileNameSelect" value=""/>
		
		{{each(i, field) fields}}
		<div class="form-group">
			<label for="${field.id}" class="col-lg-2 col-sm-2 control-label">${field.description} 
				{{if (field.type == 'number')}}
			 		(${field.unit})
		 		{{/if}}
			 </label>
			<div class="col-lg-10 col-sm-10">
				{{if (field.type == 'text')}}
					{{if (field.required == 'yes')}}
						<input type="text" class="form-control" name="${field.name}" id="${field.id}" ${disabled} value="${field.value}" required/>
					{{else}}
						<input type="text" class="form-control" name="${field.name}" id="${field.id}" ${disabled} value="${field.value}"/>
					{{/if}}
				{{else (field.type == 'number')}}
					<div class="col-lg-10 col-sm-10">
						{{if (field.required == 'yes')}}
							{{if (field.formula != '')}}
								<input type="number" class="form-control col-lg-10 col-sm-10" name="${field.name}" id="${field.id}" disabled="disabled" value="${field.value}" required/>
							{{else}}
								<input type="number" class="form-control col-lg-10 col-sm-10" name="${field.name}" id="${field.id}" ${disabled} value="${field.value}" required/>
							{{/if}}							
						{{else}}
							{{if (field.formula != '')}}
								<input type="number" class="form-control col-lg-10 col-sm-10" name="${field.name}" id="${field.id}" disabled="disabled" value="${field.value}"/>
							{{else}}
								<input type="number" class="form-control col-lg-10 col-sm-10" name="${field.name}" id="${field.id}" ${disabled} value="${field.value}"/>
							{{/if}}								
						{{/if}}
					</div>
					<div class="col-lg-2 col-sm-2">
						<button id='' class='formula btn btn-xs btn-warning' title='Formula of the Field'><i class='fa fa-facebook'></i><i class='fa fa-times'></i></button>
						{{if (field.formula != '')}}
							<button id='' class='removeFormula btn btn-xs btn-danger' title='Remove Formula to Field'><i class="fa fa-times-circle"></i></button>
						{{else}}
							<button id='' class='removeFormula btn btn-xs btn-danger' title='Remove Formula to Field' disabled="disabled"><i class="fa fa-times-circle"></i></button>
						{{/if}}
					</div>					 
				{{else}}
					{{if (field.required == 'yes')}}
						<input type="date" class="form-control" name="${field.name}" id="${field.id}" ${disabled} value="${field.value}" required/>
					{{else}}
						<input type="date" class="form-control" name="${field.name}" id="${field.id}" ${disabled} value="${field.value}"/>
					{{/if}}
				{{/if}}
			</div>
		</div>
		{{/each}}
		
		<script language="javascript">
			setDatePicker();
			$("#dynamic-bb-form").validate({
				debug: true,
			 	rules: {
				 	currentInventory: {
			 			required: true,
				 		number: true
				 	},
			 	},
				success: "valid",
				submitHandler: function(form,data) {
					editOperatingParams(data.originalEvent.explicitOriginalTarget);
				}
			});
		</script>

</div>

