
$( document ).ready( function(){
	window.DIAGRAM_FACADE = new DiagramFacade({isExecutionMode:false});
	window.DIAGRAM_FACADE.createDiagram("#canvas");
	window.DIAGRAM_FACADE.setSelectionTool();
	window.DIAGRAM_FACADE.setClipboardTools();
});
