/**************************************************************/
/*                                                            */
/* Tickster plugin by Queensbridge                            */
/*                                                            */			
/**************************************************************/	
(function($) {  
	
	// Set default values
	var defaults = {
		timer : null,
		forceAnimation : true,
		speed: 10,
		direction: 'left',
		needsAnimation : false
	};
	
	var methods = {
		
	  // Init method builds the Tickster
	  init : function(options) {
			
	  	var obj = $(this);
	  	var settings = $.extend({}, defaults, options);
	  	
	  	if( obj.find('ul:first > li').length == 0 ) { return false; }
	  	
	  	obj.addClass('tickster-processed');
			obj.find('> ul:first').addClass('tickster-' + settings.direction);	  	
	  	obj.find('ul:first > li').addClass('tickster-original');
			obj.tickster('setSize', settings);
	  		  	
	  	obj.find('ul:first > li').live('mouseover', function() { obj.tickster('pause', settings); });	
	  	obj.find('ul:first > li').live('mouseout', function() { obj.tickster('play', settings); });
			
	  	$(window).resize( function() {
				obj.tickster('setSize', settings);
	  	});
	  }, 
	  
	  
	  // Adjust number of items depending on available width
	  setSize : function( settings ) {
	  	var obj = $(this);
	  	var list = obj.find('> ul:first');
	  	var ticksterWidth = obj.width();
	  	var itemsWidth = 0;
	  	var firstItemWidth = list.find('> li:first').outerWidth(true);
	  	var lastItemWidth = list.find('> li:last').outerWidth(true);	  	
	  	list.find('li:not(.tickster-original)').remove();
		  list.find('> li').each(function() {
	  	  itemsWidth += $(this).outerWidth(true);
		  });	
			
		  if( 
		  	( itemsWidth < ticksterWidth && settings.forceAnimation ) ||
		  	( itemsWidth > ticksterWidth )
		  ) {
			  settings.needsAnimation = true;		  
			  var i = 0;
			  var l = null;

			  while( itemsWidth < ( ticksterWidth + firstItemWidth + lastItemWidth ) ) {
			  	l = list.find('li:eq(' + i + ')');
			  	if( l.length == 0 ) {
				  	l = list.find('li:first');				  	
			  		i = 0;
			  	}
			  	itemsWidth += l.outerWidth(true);
			  	l = l.clone();
			  	l.removeClass('tickster-original');
			  	l.appendTo(list);
			  	l = null;
			  	++i;
			  }
			  obj.find('ul').width( itemsWidth );
			  
		  	obj.tickster('pause', settings);			  
			  obj.tickster('animate', settings);
			  
		  } else {
			  settings.needsAnimation = false;		  
		  	obj.tickster('pause', settings);
		  	list.css(settings.direction, 0);
		  }

	  },
	  
	  // Make it move
	  animate : function( settings ) {
	  	var obj = $(this);
	  	var list = obj.find('> ul:first');
	  	var firstItem = list.find('> li:first');
	  	var lastItem = list.find('> li:last');
	  	var listPos = list.css(settings.direction);
	  			listPos = parseInt( listPos.substring(0, listPos.length-2) );

	  	// Check if the first list item (or last depending on direction) is out of view and should be put last
	  	var ticksterWidth = obj.width();
	  	var listWidth = list.outerWidth();
	  	var firstItemWidth = firstItem.outerWidth(true);
	  	var lastItemWidth = lastItem.outerWidth(true);	  	
	  	
		  if( ( listPos * -1 ) >= firstItemWidth ) {
		    var cutLi = firstItem.detach();
		    cutLi.appendTo(list);
		    cutLi = null;
		    listPos = 0;
		  }		  	
	  	
	  	if( settings.direction == 'right' ) {	  	
	  		list.css({ right: ( listPos - 1 ) + 'px' });
	  	} else {
	  		list.css({ left: ( listPos - 1 ) + 'px' });
	  	}
	  	obj.data( 'timer', setTimeout(function() { obj.tickster('animate', settings) }, settings.speed) );
	  	
	  },
	  
	  // Pause
	  pause : function( settings ) {
	  	var obj = $(this);	  
	  	clearInterval( obj.data( 'timer') );
	  	obj.data( 'timer', null)
	  },

	  // Play	  
	  play : function( settings ) {
	  	var obj = $(this);
	  	if( settings.needsAnimation ) {
		  	obj.tickster('animate', settings);	  
	  	}
	  }
	  
	}

	$.fn.tickster = function( method ) {
		
		var args = arguments;
	  return this.each(function() {

	  	// Method calling logic
	  	if ( methods[method] ) {
	    	return methods[ method ].apply( this, Array.prototype.slice.call( args, 1 ));
		  } else if ( typeof method === 'object' || ! method ) {
			  return methods.init.apply( this, args );
				//return methods.init.apply( this, new Array(method) );
	  	} else {
	  		return false;
		  } 
		  
		});
		
	}
	
})( jQuery );