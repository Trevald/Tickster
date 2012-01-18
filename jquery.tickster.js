/**************************************************************/
/*                                                            */
/* Tickster plugin by Queensbridge                            */
/*                                                            */
/**************************************************************/
(function($) {
    
    // Set default values
    var defaults = {
        timer: null,
        forceAnimation : true,
        speed: 10,
        direction: 'left',
        needsAnimation : false
    };
    
    var methods = {
        // Init method builds the Tickster
        init : function(options) {
            var obj = $(this),
                list = obj.children().first();
            var settings = $.extend({}, defaults, options);
            
            if( obj.find('ul:first > li').length === 0 ) { return false; }
            
            obj.addClass('tickster-processed');
            list.addClass('tickster-' + settings.direction);
            list.children('li').addClass('tickster-original');
            obj.tickster('setSize', settings);
            
            list.on('mouseover', 'li', function () { obj.tickster('pause', settings); });
            list.on('mouseout', 'li', function () { obj.tickster('play', settings); });
                
            $(window).resize( function() {
                obj.tickster('setSize', settings);
            });
        },
      
        // Adjust number of items depending on available width
        setSize : function( settings ) {
            var obj = $(this),
                list = obj.children().first(),
                ticksterWidth = obj.width(),
                itemsWidth = 0,
                firstItemWidth = list.children().first().outerWidth(true),
                lastItemWidth = list.children().last().outerWidth(true);

            list.children('li').not('.tickster-original').remove();
            list.children('li').each(function() {
                itemsWidth += $(this).outerWidth(true);
            });
                
            if( ( itemsWidth < ticksterWidth && settings.forceAnimation ) ||
                ( itemsWidth > ticksterWidth ) ) {
                settings.needsAnimation = true;
                var i = 0,
                    l = null;

                while( itemsWidth < ( ticksterWidth + firstItemWidth + lastItemWidth ) ) {
                    l = list.children('li').eq(i);

                    if( l.length === 0 ) {
                        l = list.children('li').first();
                        i = 0;
                    }

                    itemsWidth += l.outerWidth(true);
                    l.clone().removeClass('tickster-original').appendTo(list);
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
            var obj = $(this),
                list = obj.children().first(),
                firstItem = list.children().first(),
                lastItem = list.children().last(),
                listPos = list.css( settings.direction );

            listPos = parseInt( listPos, 10 );

            // Check if the first list item (or last depending on direction) is out of view and should be put last
            var ticksterWidth = obj.width(),
                listWidth = list.outerWidth(),
                firstItemWidth = firstItem.outerWidth(true),
                lastItemWidth = lastItem.outerWidth(true);
            
            if( -listPos >= firstItemWidth ) {
                firstItem.detach().appendTo(list);
                listPos = 0;
            }
            
            if( settings.direction == 'right' ) {
                list.css({ right: ( listPos - 1 ) });
            } else {
                list.css({ left: ( listPos - 1 ) });
            }

            obj.data( 'timer', setTimeout(function() { obj.tickster('animate', settings); }, settings.speed) );
        },
      
        // Pause
        pause : function( settings ) {
            var obj = $(this);
            clearInterval( obj.data( 'timer') );
            obj.data( 'timer', null );
        },

        // Play
        play : function( settings ) {
            var obj = $(this);
            if( settings.needsAnimation ) {
                obj.tickster('animate', settings);
            }
        }
    };

    $.fn.tickster = function( method ) {
        var args = arguments;

        return this.each(function() {
            // Method calling logic
            if ( methods[method] ) {
                return methods[ method ].apply( this, Array.prototype.slice.call( args, 1 ));
            } else if ( typeof method === 'object' || !method ) {
              return methods.init.apply( this, args );
            } else {
                return false;
            }
        });
    };
})( jQuery );