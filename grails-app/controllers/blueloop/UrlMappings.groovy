package blueloop

class UrlMappings {

	static mappings = {
//		/** API URL **/
//		"/services/**" (controller:"jaxrs")
//		"/services" (controller:"jaxrs")
//		
//		/** OAUTH URL **/
//		"/oauth/authorize"(uri:"oauth/authorize.dispatch")
//		"/oauth/token"(uri:"/oauth/token.dispatch")
		
		"/$controller/$action?/$id?"{
			constraints {
				// apply constraints here
			}
		}

		"/"(view:"/index")
//		"/"(controller:"index")
//		"500"(view:'/error')
		
		//Update User Personal Info
		"/user/updatePI" (controller: "user") {
			
			action = [GET: "updatePI"]
		}
		
		//Update User Language
		"/user/updateL" (controller: "user") {
			
			action = [GET: "updateL"]
		}
		
		//Update User Email
		"/user/updateE" (controller: "user") {
			
			action = [GET: "updateE"]
		}
		
		//Update User Email
		"/user/updateCP" (controller: "user") {
			
			action = [GET: "updateCP"]
		}
		
		//Search User Notifications Preferences
		"/user/searchNotifications" (controller: "user") {
			
			action = [GET: "searchNotifications"]
		}
		
		//Search User Notifications Preferences
		"/user/deleteImage" (controller: "user") {
			
			action = [GET: "deleteImage"]
		}
		
		//List All Users
		"/user/list" (controller: "user") {
			
			action = [GET: "list"]
		}
		
		//Get all Team Members 
		"/teamwork/getAllTeamwork" (controller: "teamwork") {
			
			action = [GET: "getAllTeamwork"]
		}
		
		//Get Teamwork with members
		"/teamwork/getTeamwork" (controller: "teamwork") {
			
			action = [GET: "getTeamwork"]
		}
		
		//Get Teamwork with members
		"/teamwork/getMembers" (controller: "teamwork") {
			
			action = [GET: "getMembers"]
		}
		
		//Delete TeamWork
		"/teamwork/deleteGroup/$id" (controller: "teamwork"){
			
			action = [DELETE:"deleteGroup"]   
		}
		
		//Update TeamWork
		"/teamwork/updateGroup/" (controller: "teamwork"){
			
			action = [GET:"updateGroup"]
		}
		
		//Create TeamWork
		"/teamwork/createGroup/" (controller: "teamwork"){
			
			action = [GET:"createGroup"]
		}
		
		//get Members By Building Block  
		"/teamwork/getMembersByBB/" (controller: "teamwork"){
			
			action = [GET:"getMembersByBB"]
		}
		
		//search Chain
		"/chain/delete/$id" (controller: "chain"){
			
			action = [POST:"delete"]
		}
		
		//activate Chain
		"/chain/activate/" (controller: "chain"){
			
			action = [GET:"activate"]
		}
		
		//Orders List
		"/orderChain/list/" (controller: "orderChain"){
			
			action = [GET:"listOrder"]
		}
		
		//Orders Save
		"/orderChain/save/" (controller: "orderChain"){
			
			action = [GET:"saveOrder"]
		}
		
		//Orders EditForm
		"/orderChain/editForm/" (controller: "orderChain"){
			
			action = [GET:"editForm"]
		}
		
		//Orders Edit
		"/orderChain/edit/" (controller: "orderChain"){
			
			action = [GET:"editOrder"]
		}
		//export to pdf
		"/chain/export" (controller: "chain") {
			
			action = [POST: "export"]
		}
		"/chain/export1" (controller: "chain") {
			
			action = [GET: "export1"]
		}
		
		//For Test
		"/chain/test/" (controller: "chain"){
			
			action = [POST:"test"]
		}
		
		//FirstTime of Save Chain
		"/chain/saveChain/" (controller: "chain"){
			
			action = [POST:"saveChain"]
		}
		
		//Update chain name
		"/chain/updateChainName/" (controller: "chain"){
			
			action = [POST:"updateChainName"]
		}
		
		//Update chain
		"/chain/updateChain/" (controller: "chain"){
			
			action = [POST:"updateChain"]
		}
		
		//Edit chat group
		"/chat/editGroup/" (controller: "chat"){
			
			action = [GET:"editGroup"]
		}
		
		
		//Get all Building Block
		"/buildingBlock/getAllMyBuildingBlock/" (controller: "buildingBlock"){
			
			action = [GET:"getAllMyBuildingBlock"]
		}
		
		//Get all Building Block
		"/buildingBlock/getImage" (controller: "buildingBlock"){
			
			action = [GET:"getImage"]
		}
		
		//Save Building Block
		"/buildingBlock/saveBuildingBlock/" (controller: "buildingBlock"){
			
			action = [GET:"saveBuildingBlock"]
		}	
			
		//Get all Risk By BB
		"/risk/getAllRiskByBb/" (controller: "risk"){
			
			action = [GET:"getAllRiskByBb"]
		}
		
	}	
}