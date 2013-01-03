/**/
 
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
	$("#treeview").treeview("destroy");
});
/**/
test("Checkbox rendering", function() {
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
		dataModel: model,
		checkable: true
	});
	
	same($("#treeview > ul > li:first > span.checkbox").length, 1);
	ok($("#treeview > ul > li:first > span.checkbox").hasClass("ui-treeview-emptyicon")
			, "initial empty icon shown");
	
	$("#treeview").treeview("destroy");
});

test("Custom node title renderer", function() {
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
		dataModel: model,
		nodeRenderer: function(nodeModel) {
			return nodeModel().title() + '---';
		}
	});
	same($("#treeview > ul > li:first > .ui-treeview-nodetitle").html(), "root node 01---");
	$("#treeview").treeview("destroy");
});

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

test("onCheckboxChange", function() {
	var model = $.observable({
		title: "jquery.treeview demo",
		childNodes: [
			{
				title: 'root node 01',
				selected: false,
				childNodes: [
					{
						title: "node 01 01",
						selected: false,
						childNodes: [
							{
								title: "node 01 01 01",
								selected: true
							}
						]
					}
				]
			},
			{
				title: 'root node 02',
				selected: true,
				childNodes: []
			}
		]
	});
	var called = false;
	$("#treeview").treeview({
		dataModel: model,
		checkable: true,
		bindCheckboxesTo: 'selected',
		onCheckboxChange: function(value, data, e) {
			called = true;
			ok(value, "value arg correct");
		}
	});
	
	ok($("#treeview > ul > li:eq(1) > span.checkbox:first").hasClass("ui-icon-check")
		, "root node properly checked" );
	
	ok($("#treeview > ul > li:first > ul > li > ul > li > span.checkbox:first").hasClass("ui-icon-check")
		, "root node properly checked" );
		
	modelChanged = false;
	model().childNodes(0)().selected.on('change', function(newVal) {
		modelChanged = true;
		ok(newVal, "model change properly written");
	});
	
	$("#treeview > ul > li:first > span.checkbox:first").click();
	
	ok(modelChanged);
	ok(called, "onCheckboxChange fired properly");
	
	$("#treeview").treeview("destroy");
});

test("maintain{Child,Parent}Checkboxes", function() {
	var model = $.observable({
		title: "jquery.treeview demo",
		childNodes: [
			{
				title: 'root node 01',
				selected: false,
				childNodes: [
					{
						title: "node 01 01",
						selected: false,
						childNodes: [
							{
								title: "node 01 01 01",
								selected: true
							},
							{
								title: "node 01 01 02",
								selected: false
							}
						]
					},
					{
						title: "node 01 02",
						selected: false
					}
				]
			},
			{
				title: 'root node 02',
				selected: true,
				childNodes: []
			}
		]
	});
	
	$("#treeview").treeview({
		dataModel: model,
		checkable: true,
		bindCheckboxesTo: 'selected',
	});
	
	$("#treeview > ul > li:first > ul > li:first > ul > li:eq(1) > .checkbox").click();
	
	ok($("#treeview > ul > li:first > ul > li:first > .checkbox").hasClass('ui-icon-check')
		, "direct (true) parent rendering is correct");
		
	ok($("#treeview > ul > li:first > ul > li:first > .checkbox").data("ui-treeview-nodemodel")().selected()
		, "direct (true) parent value written to model");
	
	ok($("#treeview > ul > li:first > .checkbox").hasClass('ui-icon-minus')
		, "mixed parent rendering is correct");

	// good question why it fails, since it is rendered properly..
	same($("#treeview > ul > li:first > ul > li:first > .checkbox")
		.click()
		.parent()
		.find("span.ui-treeview-emptyicon").length, 2);
	
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
	$("#treeview").treeview("destroy");
});

test("checkbox bound property change", function() {
	var model = $.observable({
		title: "jquery.treeview demo",
		childNodes: [
			{
				title: 'root node 01',
				selected: true,
				childNodes: []
			},
			{
				title: "root node 02",
				selected: false,
				childNodes: []
			},
			{
				title: 'root node 03',
				selected: null,
				childNodes: []
			}
		],
	});
	
	$("#treeview").treeview({
		dataModel: model,
		checkable: true,
		bindCheckboxesTo: 'selected',
		onCheckboxChange: function() {
			console.log('fired')
		}
	});
	
	model().childNodes(0)().selected(false);
	
	ok($("#treeview  span.checkbox:first").hasClass('ui-treeview-emptyicon'), "false val rendered properly");
	
	model().childNodes(0)().selected(null);
	
	ok($("#treeview  span.checkbox:first").hasClass('ui-icon-minus'), "null val rendered properly");
	
	model().childNodes(0)().selected(true);
	
	ok($("#treeview  span.checkbox:first").hasClass("ui-icon-check"), "true val rendered properly");
	
	$("#treeview").treeview("destroy");
});

test("checkbox bound property change", function() {
	var model = $.observable({
		title: "jquery.treeview demo",
		childNodes: [
			{
				title: 'root node 01',
				selected: true,
				childNodes: []
			},
			{
				title: "root node 02",
				selected: false,
				childNodes: []
			},
			{
				title: 'root node 03',
				selected: null,
				childNodes: []
			}
		],
	});
	
	$("#treeview").treeview({
		dataModel: model,
		//checkable: true,
		bindCheckboxesTo: 'selected',
		nodeRenderer: function(nodeModel) {
			var wrapper = $("<span/>");
			var addButton = $('<input type="button" value="+"/>').click(function(e) {
				nodeModel().childNodes.push({
					title: "subnode",
					selected: true,
					childNodes: []
				});
				e.stopPropagation();
			});
			return wrapper.append(nodeModel().title()).append(addButton)
		}
	});
	$("#treeview").treeview("destroy");
});

test("sorting", function() {
	var model = $.observable({
		title: "jquery.treeview demo",
		childNodes: [
			{
				title: 'root node 01',
				order: 1,
				childNodes: [
					{title: "node 01 01", "order": 0},
					{title: "node 01 02", "order": 1},
					{title: "node 01 03", "order": 2}
				]
			},
			{
				title: "root node 02",
				order: 2,
				childNodes: [
					{title: "node 02 01", "order": 0},
					{title: "node 02 02", "order": 1}
				]
			},
			{
				title: 'root node 03',
				order: 3,
				childNodes: [
					{title: "node 03 01", "order": 0},
					{title: "node 03 02", "order": 1}
				]
			}
		],
	});
	$("#treeview").treeview({
		checkable: true,
		dataModel: model,
		sortOptions: {},
		bindOrderTo: "order"
	});
});



/**/
