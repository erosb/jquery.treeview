module("Basics")

test("Contstructor testing", function() {
	
	var model = $.observable({
		title: "jquery.treeview",
		rootNodes: []
	});
	
	$("#treeview").treeview({
		dataModel: model
	});
	
	same( $("#treeview").data("treeview-options").dataModel, model, "options properly associated with DOM elem");
	
	ok($("#treeview").hasClass("ui-widget"), ".ui-widget added");
	ok($("#treeview").hasClass("ui-widget-content"), ".ui-widget-content added");
	
	same($("#treeview .ui-widget-header").html(), "jquery.treeview", "title header properly rendered");
	
	
	
});
