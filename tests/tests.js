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
	
	same( $("#treeview").data("ui-treeview-options").dataModel, model, "options properly associated with DOM elem");
	
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
				title: 'root node 02',
				childNodes: []
			}
		]
	});
	
	$("#treeview").treeview({
		dataModel: model
	});
	
	same($("#treeview > ul > li").length, 2, "root node <li> tags");
	same($("#treeview > ul > li > ul > li > ul > li > span.ui-treeview-nodetitle").html(), "node 01 01 01", "recursive node rendering");
//	$("#treeview").treeview("destroy");
});
/*
module("Event handling");

test("onNodeClick", function() {
	var model = $.observable({
		title: "jquery.treeview demo",
		childNodes: [
			{
				title: 'root node 01'
			},
			{
				title: 'root node 02'
			}
		],
	});
	
	var called = false;
	
	$("#treeview").treeview({
		dataModel: model,
		onNodeClick: function(data, e) {
			called = true;
			same($.observable.remove(data), {title: "root node 02"}, "data arg correct");
		}
	}).find("> ul > li > span:last").click();
	
	ok(called, "onNodeClick fired");
	
	$("#treeview").treeview("destroy");
});

module("Data change handling");

test("title change", function() {
	var model = $.observable({
		title: "jquery.treeview demo",
		childNodes: [
			{
				title: 'root node 01'
			},
			{
				title: 'root node 02'
			}
		],
	});
	
	$("#treeview").treeview({
		dataModel: model
	});
	
	model().childNodes(0)().title("new title");
	
	same($("#treeview > ul > li:first > span.ui-treeview-nodetitle").html(), "new title", "title change handled properly");
	$("#treeview").treeview("destroy");
});

test("nodelist change", function() {
	var model = $.observable({
		title: "jquery.treeview demo",
		childNodes: [
			{
				title: 'root node 01'
			},
			{
				title: 'root node 02'
			}
		],
	});
	
	$("#treeview").treeview({
		dataModel: model
	});
	model().childNodes.push({
		title: "root node 03"
	});
	
	same($("#treeview > ul > li:eq(2) > span.ui-treeview-nodetitle").html(), "root node 03", "nodelist change handled properly");
	//$("#treeview").treeview("destroy");
});


/**/
