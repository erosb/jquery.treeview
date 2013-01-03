jquery.treeview
===============


This plugin implements a jQuery UI compliant, data-driven tree view GUI control.

It is built on my jquery.observable library: <https://github.com/crystal88/jquery.observable> .

In short it provides a function that wraps a plain javascript data structure into an
observable object that runs some attached event listeners when the data changes. I would
recommend reading the manual of jquery.observable before using jquery.treeview.

Getting started
---------------

Let's create a simple treeview with 2 root nodes and nothing else:

	<script type="text/javascript">
	// we create on observable data structure
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
	
	// we create the UI control
	$("#treeview").treeview({
		dataModel: model
	});	
	</script>
	<div id="treeview"></div>
	
In the data model every node must have a property named 'title' and if it has
childnodes, then the childnodes must be in an array property named 'childNodes'.
The component will interpret the nodes without a 'childNodes' property as a leaf node.

The treeview control adds its event listeners to the data model and updates itself if
the data structure changes. No additional operation is needed to keep the data structure
and its UI representation in sync:

	// the text of the first node will be updated by jquery.treeview
	model().childNodes(0)().title("new title");
	// the list of the child-nodes will be updated
	model().childNodes.push({
		title: "root node 03"
	});
	
Treeview with checkboxes
------------------------

If you set the 'checkable' property in the constructor then the treeview will render a checkbox
before each node. Example:

	<script type="text/javascript">
	
	// same data structure as we had in the above examples
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
		dataModel: model,
		checkable: true
	});
	
	</script>

The treeview control won't render HTML checkbox inputs but it has its own checkbox "implementation".
This is needed since the HTML checkbox has only 2 states: checked and unchecked - but when
we work with a treeview, we need a third "null" state, that mean that the node has both
checked and unchecked childnodes therefore its state is not determined.

If the 'checkable' property is true in the constructor call, then it is possible to add
an event listener to checkbox value changes:

	<script type="text/javascript">
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
		dataModel: model,
		checkable: true,
		onCheckboxChange: function(value, data, e) {
			// the value is true or false
			console.log(value);
		}
	});
	</script>
	
In the event handler the value is always true or false: the event won't be triggered
when the checkbox goes into "null" state since it never happens on direct user input on
the checkbox but happens on automatic checkbox value updates based on user input on an
other checkbox. See later.

The data argument is the node in the data model which is associated to the given checkbox.
The node is wrapped by jquery.observable . In the event handler 'this' will refer to the
corresponding DOM element (the 'span' element that displays the checkbox).


Binding the checkbox values
---------------------------

Using the 'bindCheckboxesTo' property in the constructor it is easy - and highly recommended
to bind the value of the node checkboxes to a property in the data model. Furthermore the
control will take the value property into account when the nodes are rendered.

Example:

	<script type="text/javascript">
	var model = $.observable({
		title: "jquery.treeview demo",
		childNodes: [
			{
				title: 'root node 01',
				selected: true
			},
			{
				title: 'root node 02',
				selected: false
			}
		]
	});
	
	$("#treeview").treeview({
		dataModel: model,
		checkable: true,
		// we bind the checkbox values to the 'selected' property of the nodes
		bindCheckboxesTo: 'selected'
	});
	
	model().childNodes(1)().selected(true);
	</script>

If you run this example then you will notice the followings:

 * the checkboxes are displayed according to the 'selected' properties of the nodes
 * the control will update the data structure if you click on the checkboxes
 * the control will update the checkboxes when the data model changes


Maintaining parent- and childnode states
----------------------------------------

If the user clicks on a given checkbox then the control will maintain the states
of the checkboxes of the parent- and childnodes.

This "maintenance" follows these rules:

 * if the user clicks on a checkbox then all child checkboxes will turn into the new state
		of the checkbox (eg. if the checkbox is checked then all child checkboxes will be
		checked too).
 * if the user clicks on a checkbox then the state of all parent nodes will be re-determined, which
		means the following: if all childnodes of the given parent checkbox are in true (false)
		state then the state of the given parent node will be true (false). Otherwise (if the node
		has both true and false child checkboxes) the state of the parent node will be undetermined
		which means "null", and a minus sign will be displayed in the checkbox.
		
During this maintenance not only the state of the checkboxes will be updated but the represented
data too - assuming that the 'bindCheckboxesTo' property is not null. This means full data binding support.
The maintenance process won't fire the 'onCheckboxChange' event on the automatically updated
checkboxes.

The parent- and childnode maintenance can be turned off by setting both 'maintainParentCheckboxes'
and 'maintainChildCheckboxes' properties in the constructor to 'false'.

Sortable trees
--------------

jquery.treeview supports sortable trees. By "sortable" I mean the direct childnodes of every
node can be sortable (by taking the advantage of <a href="http://api.jqueryui.com/sortable/">jquery.sortable</a>),
but currently it is not possible to move a node to an other subtree my drag & drop. So let's see the syntax:

	$("#treeview").treeview({
		dataModel: model,
		sortOptions: {},
	});
	
You can enable the sorting by adding a 'sortOptions' key to the constructor object. Its value
must be an object, containing the options to be passed to the 'jquery.sortable()' constructor.
In the above example it is just an empty object.

With the above setup jquery.treeview will call jquery.sortable() on every childnode-list. When
the user changes the ordering of the childnodes by drag & drop, then the childnodes in the dataModel
will also be swapped automatically.

If you want to store the ordering in the childnode objects themselves too, you should use the
'bindOrderTo' option of the treeview. If you specify this option (must be a string) then you bind
the ordering to the given property of the childnode objects. This property will be maintained by
jquery.treeview Example (we use the 'order' property here for storing the order):

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
	);
	$("#treeview").treeview({
		checkable: true,
		dataModel: model,
		sortOptions: {},
		bindOrderTo: "order"
	});

With this setup if the user swaps for example 'node 01 01' and 'node 01 02' then two things
will happen:

 * in the 'childNodes' array of 'root node 01' the position 'node 01 01' and 'node 01 02' will be swapped
 * the 'order' value of 'node 01 01' will be changed to 1
 * the 'order' value of 'node 01 02' will be changed to 0

Destroying the treeview control
-------------------------------

Once created, the treeview control can be destroyed using the "destroy" method:

	$("#treeview").treeview("destroy");
	
Since the component is primarily data-driven it doesn't have any more methods.


