module("Basics")

test("Contstructor testing", function() {
	
	var model = $.observable({
		title: "jquery.treeview demo",
		childNodes: [
			{
				title: 'root node 01'
			},
			{
				title: 'root node 02'
			}
		]
	});
	
	$("#treeview").treeview({
		dataModel: model
	});
	
	same( $("#treeview").data("treeview-options").dataModel, model, "options properly associated with DOM elem");
	
	ok($("#treeview").hasClass("ui-widget"), ".ui-widget added");
	ok($("#treeview").hasClass("ui-widget-content"), ".ui-widget-content added");
	
	same($("#treeview .ui-widget-header").html(), "jquery.treeview demo", "title header properly rendered");
	
	
	$("#treeview").treeview("destroy");
});


test("Rendering testing", function() {
	var model = $.observable({
		title: "jquery.treeview demo",
		childNodes: [
			{
				title: 'root node 01',
				childNodes: [
					{
						title: "node 01 01",
						childNodes: [
							{
								title: "node 01 01 01"
							}
						]
					}
				]
			},
			{
				title: 'root node 02'
			}
		]
	});
	
	$("#treeview").treeview({
		dataModel: model
	});
	
	same($("#treeview > ul > li").length, 2, "root node <li> tags");
	same($("#treeview > ul > li > ul > li > ul > li > span").html(), "node 01 01 01", "recursive node rendering");
	
});
