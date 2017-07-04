<div class="staticForm">
		<input class="form-control" type="hidden" name="id" id="id" value="${id}"/>
		<input class="form-control" type="hidden" name="type" id="type" value="${type}"/>
		<input class="form-control" type="hidden" name="fileName" id="fileName" value="${fileName}"/>
		<input class="form-control" type="hidden" name="fileNameSelect" id="fileNameSelect" value=""/>
		
		<div class="form-group">
			<label for="name" class="col-lg-2 col-sm-2 control-label">Name</label>
			<div class="col-lg-10 col-sm-10">
				<input type="text" class="form-control staticField" name="name" id="name" ${disabled} value="${name}" required/>
			</div>
		</div>
		
		<div class="form-group">
			<label for="description" class="col-lg-2 col-sm-2 control-label">Description</label>
			<div class="col-lg-10 col-sm-10">
				<input type="text" class="form-control staticField" name="description" id="description" ${disabled} value="${description}" required/>
			</div>
		</div>
		
		<div class="form-group">
			<label for="companyName" class="col-lg-2 col-sm-2 control-label">Company Name</label>
			<div class="col-lg-10 col-sm-10">
				<input type="text" class="form-control staticField" name="companyName" id="companyName" ${disabled} value="${companyName}" required/>
			</div>
		</div>
		
		<div class="form-group">
			<label for="phoneNumber" class="col-lg-2 col-sm-2 control-label">Phone Number</label>
			<div class="col-lg-10 col-sm-10">
				<div class="input-group m-bot15">
		        	<span class="input-group-addon">   
		        		<select class="selectAreaCode" id="selectAreaCode" name="selecAreaCode">	
		        		{{each(j, country) countries}}
							<option value="${country.areaCode}">${country.name  + ' (' + country.areaCode + ')' }</option>
						{{/each}}
						</select>						
						<input type="text" class="selectAreaCode" name="phoneNumberAreaCode" id="phoneNumberAreaCode" readonly value="${phoneNumberAreaCode}" required/>			       	
		            </span>
		            <input type="text" class="form-control staticField" name="phoneNumber" id="phoneNumber" ${disabled} value="${phoneNumber}" required/>
		        </div>					
			</div>
		</div>
		
		<div class="form-group">
			<label for="emailAddress" class="col-lg-2 col-sm-2 control-label">Email</label>
			<div class="col-lg-10 col-sm-10">
				<input type="text" class="form-control staticField" name="emailAddress" id="emailAddress" ${disabled} value="${emailAddress}" required/>
			</div>
		</div>

	{{if (edit == true)}}
		<div class="form-group">
			<label for="userCreator" class="col-lg-2 col-sm-2 control-label">Created by</label>
			<div class="col-lg-10 col-sm-10">
				<input type="text" class="form-control staticField" name="userCreator" id="userCreator" disabled value="${creator.name}" required/>
			</div>
		</div>
		
		<div class="form-group">
			<label for="ownership" class="col-lg-2 col-sm-2 control-label">Ownership</label>
				<div class="col-lg-10 col-sm-10">

				{{if (currentLoggedUser == owner.id) || (currentLoggedUser == creator.id)}}
					<select class="form-control staticField" name="ownership" id="ownership">
				{{else}}
					<select class="form-control staticField" name="ownership" id="ownership" disabled>
				{{/if}}
						{{each(i, us) community}}
							{{if (us.id == owner.id)}}
							<option value="${us.id}" selected>${us.firstName + ' ' + us.lastName}</option>
							{{else}}
							<option value="${us.id}">${us.firstName + ' ' + us.lastName}</option>
							{{/if}}
						{{/each}}
					</select>
				</div>
		</div>
	{{/if}}
		
		<script language="javascript">
			setDatePicker();
			$("#static-bb-form").validate({
				debug: true,
			 	rules: {
				 	currentInventory: {
			 			required: true,
				 		number: true
				 	},
			 	},
				success: "valid",
				submitHandler: function(form,data) {
					saveBuildingBlock(data.originalEvent.explicitOriginalTarget);
				}
			});
		</script>

</div>

