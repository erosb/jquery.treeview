(function( $ ) {
	
	"use strict";
	
	var publicMethods = {
		destroy: function() {
			$(this).empty().data("ui-treeview-options", null);
		}
	};
	
	var eventHandlers = {
		onNodeClick: function(e, ui) {
			var childNodes = $(this).parent().find('> ul');
			var options = privateMethods.fetchOptions(this);
			if ( $.isFunction(options.onNodeClick) ) {
				options.onNodeClick.call(this, $(this).data('ui-treeview-nodemodel'), e);
			}
			if (childNodes.length > 0) {
				if (childNodes.is(":visible") ) {
					childNodes.hide();
					$(this).parent().find('> span.ui-icon')
						.removeClass(options.openedNodeClass)
						.addClass(options.closedNodeClass);
				} else {
					childNodes.show();
					$(this).parent().find('> span.ui-icon')
						.removeClass(options.closedNodeClass)
						.addClass(options.openedNodeClass);
				}
			}
		},
		onCheckboxClick: function() {
			var val = null;
			if ($(this).hasClass("ui-icon-check")) {
				val = false;
			} else if ($(this).hasClass("ui-treeview-emptyicon")  || $(this).hasClass("ui-icon-minus")) {
				val = true;
			}
			privateMethods.renderCheckboxValue(this, val);
			var nodeModel = $(this).data('ui-treeview-nodemodel');
			var options = privateMethods.fetchOptions(this);
			
			if (options.bindCheckboxesTo !== null) {
				if ( nodeModel()[options.bindCheckboxesTo] ) {
					nodeModel()[options.bindCheckboxesTo](val);
				}
			}
			
			if ( $.isFunction(options.onCheckboxChange) ) {
				options.onCheckboxChange.call(this, val
					, nodeModel);
			}
			
			if (options.maintainChildCheckboxes) {
				privateMethods.maintainChildCheckboxes(this, options);
			}
			
			if (options.maintainParentCheckboxes) {
				privateMethods.maintainParentCheckboxes(this, options);
			}
		}
	};
	
	var privateMethods = {
		maintainParentCheckboxes: function(childChkbox, options) {
			for (var ulTag = $(childChkbox).parent().parent()
				;  ! ulTag.parent().data("ui-treeview-options")
				; ulTag = ulTag.parent().parent()) {
				
				var liTag = ulTag.parent();
				var targetCheckbox = liTag.find('> span.checkbox');
				var chkboxVal = undefined;
				ulTag.find('span.checkbox').each(function() {
					var childVal = privateMethods.getCheckboxValue(this);
					if (childVal === null) {
						chkboxVal = null;
						return false;
					}
					if (childVal !== chkboxVal) {
						if (chkboxVal === undefined) {
							chkboxVal = childVal;
						} else {
							chkboxVal = null;
							return false;
						}
					}
				});
				privateMethods.renderCheckboxValue(targetCheckbox, chkboxVal);
				if (options.bindCheckboxesTo !== null) {
					targetCheckbox.data("ui-treeview-nodemodel")()[options.bindCheckboxesTo](chkboxVal);
				}
			} 
		},
		maintainChildCheckboxes: function(chkBox, options) {
			var val = privateMethods.getCheckboxValue( chkBox );
			$(chkBox).parent().find("span.checkbox").each(function() {
				privateMethods.renderCheckboxValue(this, val);
				if (options.bindCheckboxesTo !== null) {
					$(this).data("ui-treeview-nodemodel")()[options.bindCheckboxesTo](val);
				}
			});
		},
		updateNodeList: function(nodeList, DOMCtx) {
			DOMCtx = $(DOMCtx).empty();
			if ( ! nodeList.uiTreeviewManaged) {
				nodeList.on(["push"
					, "elemchange"
					, "pop"
					, "reverse"
					, "shift"
					, "unshift"]
					, function(newVal) {
						privateMethods.updateNodeList(nodeList, DOMCtx);
					});
				nodeList.uiTreeviewManaged = true;
			}
			for (var i = 0; i < nodeList().length; ++i) {
				this.updateNode( nodeList(i), DOMCtx.append('<li style="list-style-type: none"></li>').find('li:last') );
			}	
		},
		updateNode: function(nodeModel, DOMCtx) {
			DOMCtx = $(DOMCtx).empty();
			var options = this.fetchOptions(DOMCtx);
			var title = ($.isFunction(nodeModel().title) && nodeModel().title()) || '';
			var iconClass = null;
			if (nodeModel().childNodes !== undefined && nodeModel().childNodes() !== null) {
				iconClass = options.closedNodeClass;
			} else {
				iconClass = options.leafNodeClass;
			}
			
			DOMCtx.append('<span class="ui-icon ' + iconClass + '" style="display:inline-block">');
			
			if (options.checkable) {
				var chkBox = DOMCtx.append('<span class="ui-icon checkbox"></span>')
					.find('span.checkbox')
					.data('ui-treeview-nodemodel', nodeModel)
					.click(eventHandlers.onCheckboxClick);
				
				if (options.bindCheckboxesTo) {
					this.renderCheckboxValue( chkBox, nodeModel()[options.bindCheckboxesTo]() );
					nodeModel()[options.bindCheckboxesTo].on("change", function(newVal) {
						privateMethods.renderCheckboxValue(chkBox, newVal);
					});
				}
			}
			DOMCtx.append('</span><span class="ui-treeview-nodetitle"></span>')
				.find('> span.ui-treeview-nodetitle')
				.text(title)
				.data('ui-treeview-nodemodel', nodeModel)
				.click(eventHandlers.onNodeClick);
				
			DOMCtx.find('> span.' + options.closedNodeClass 
				+ ', > span.' + options.openedNodeClass).click(eventHandlers.onNodeClick);
			
			if ( ! nodeModel().title.uiTreeviewManaged) {
				nodeModel().title.on("change", function(newVal, oldVal) {
					DOMCtx.find("> span.ui-treeview-nodetitle").html(newVal);
				});
				nodeModel().title.uiTreeviewManaged = true;
			}
				
			if (nodeModel().childNodes !== undefined && nodeModel().childNodes() !== null) {
				this.updateNodeList(nodeModel().childNodes, DOMCtx.append('<ul></ul>').find('> ul'));
			}
		},
		renderCheckboxValue: function(chkBox, value) {
			chkBox = $(chkBox);
			var trueClass = ["ui-icon-check"].join(" ");
			var falseClass = ["ui-treeview-emptyicon"].join(" ");
			var nullClass = ["ui-icon-minus", "ui-state-disabled"].join(" ");
			if (value === undefined) {
				value = null;
			}
			if (true === value) {
				chkBox.removeClass(falseClass)
					.removeClass(nullClass)
					.addClass(trueClass);
			} else if (false === value) {
				chkBox.removeClass(trueClass)
					.removeClass(nullClass)
					.addClass(falseClass);
			} else if (null === value) {
				chkBox.removeClass(trueClass)
					.removeClass(falseClass)
					.addClass(nullClass)
			}
		},
		getCheckboxValue: function(chkBox) {
			chkBox = $(chkBox);
			if (chkBox.hasClass("ui-icon-check")) {
				return true;
			} else if (chkBox.hasClass("ui-icon-minus")) {
				return null;
			} else if (chkBox.hasClass("ui-treeview-emptyicon")) {
				return false;
			}
			throw "failed to determine checkbox value";
		},
		fetchOptions: function(nodeDOMElem) {
			var current = $(nodeDOMElem);
			while(current) {
				var candidate = current.data("ui-treeview-options");
				if (candidate) {
					return candidate;
				}
				current = current.parent();
			}
			return null;
		}
	};
	
	$.fn.treeview = function() {
		var options = {
			dataModel: null,
			dataSource: null,
			closedNodeClass: 'ui-icon-carat-1-e',
			openedNodeClass: 'ui-icon-carat-1-s',
			leafNodeClass: 'ui-treeview-emptyicon',
			checkable: false,
			onCheckboxChange: null,
			bindCheckboxesTo: null,
			maintainParentCheckboxes: true,
			maintainChildCheckboxes: true
		};
		
		var isConstructor = false;
		
		if (arguments.length === 1 && $.isPlainObject(arguments[0]) ) {
			options = $.extend(options, arguments[0]);
			isConstructor = true;
		} else if (arguments.length === 0) {
			isConstructor = true;
		}
		
		if (isConstructor) {
			var existingOptions = $(this).data('ui-treeview-options');
			if (existingOptions) {
				throw "can not create multiple treeviews in the same DOM element";
			}
				
			$(this).data('ui-treeview-options', options);
			
			$(this).empty()
				.addClass('ui-widget')
				.addClass('ui-widget-content')
				.addClass('ui-corner-all');

			var model = options.dataModel;
			
			if (model().title !== undefined && model().title() !== null) {
				$(this).html('<div class="ui-widget-header ui-treeview-title">'
					+ model().title() + '</div>');
			}
			
			if (model().childNodes) {
				$(this).append('<ul></ul>');
				var ulTag = $(this).find('> ul');
				privateMethods.updateNodeList(model().childNodes, ulTag);
				$(this).find('> ul ul').hide();
			}
			
		} else {
			var methodName = arguments[ 0 ];
			if ( ! publicMethods[methodName] ) {
				throw "treeview doesn't have method '" + methodName + "'";
			}
				
			var args = [];
			for (var i = 1; i < arguments.length; ++i) {
				args.push( arguments[ i ] );
			}
			publicMethods[methodName].apply(this, args);
		}
		
		return this;
	};
	
})(jQuery);
