(function( $ ) {
	
	var publicMethods = {
		
	};
	
	var privateMethods = {
		
	};
	
	$.fn.treeview = function() {
		var options = {
			dataModel: null,
			dataSource: null
		};
		
		var isConstructor = false;
		
		if (arguments.length == 1 && $.isPlainObject(arguments[0]) ) {
			options = $.extend(options, arguments[0]);
			isConstructor = true;
		} else if (arguments.length == 0) {
			isConstructor = true;
		}
		
		if (isConstructor) {
			var existingOptions = $(this).data('treeview-options');
			if (existingOptions)
				throw "can not create multiple treeviews in the same DOM element";
				
			$(this).data('treeview-options', options);
			
			$(this).empty()
				.addClass('ui-widget')
				.addClass('ui-widget-content')
				.addClass('ui-corner-all');

			var model = options.dataModel;
			
			if (model().title !== undefined && model().title() !== null) {
				$(this).html('<div class="ui-widget-header">' + model().title() + '</div><ul>');
			}
			
			
		} else {
			var methodName = arguments[ 0 ];
			if ( methods[methodName] )
				throw "treeview doesn't have method '" + methodName + "'";
				
			var args = [];
			for (var i = 1; i < arguments.length; ++i) {
				args.push( arguments[ i ] );
			}
			publicMethods[methodName].apply(this, args);
		}
		
	}
	
})(jQuery);
