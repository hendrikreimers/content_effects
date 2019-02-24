/*!
 *
 * SCROLLFY jQuery Plugin v2.0
 *
 * Listens on scroll and fires events with direction and more
 * Makes it possible to create awesome scroll animations, i think ;-)
 *
 * Made with love by Hendrik Reimers <hendrik.reimers@gmail.com>
 * www.kern23.de / www.core23.com / www.github.com/hendrikreimers
 *
 * Requirements:
 *    jQuery v3.3.1+
 *    Modern Browsers (IE 10+, ...)
 *
 * Hint:
 *    If you want that the elements are visible on load,
 *    you need to add the event listeners first and call the plugin at last.
 *    see the demos for details.
 */

(function($) { $.fn.scrollfy = function(options) {
    // Default Options
    var settings = {
        defaultOffset: 50,

        offsetAttrTop:     'scrollfy-offset-top',
        offsetAttrBottom:  'scrollfy-offset-bottom',

        eventNames: {
            scrollBegin:   'scrollfy:scroll:begin',
            scroll:        'scrollfy:scroll',
            scrollEnd:     'scrollfy:scroll:end',

            inView:        'scrollfy:inView',
            offView:       'scrollfy:offView',
        },

        scrollTimeout:    250,
        directionTimeout: 50,
        listenTo:         'scroll touchmove resize',
		inviewIdentifier: 'scrollfy-inview',

        respectElementMargin: false
    };

    // Internal data storage
    var data = {
        all: null,
        self: null,
        elements: {},
        timeoutScroll: null,
        timeoutDirection: null,
        lastScrollPosY: 0,
        direction: 'down',
        scrolling: false
    };

    // functions of this plugin
    var methods = {

        /**
         * Initialize the Plugin
         *
         */
        init: function (options, objs) {
            data.self = objs;
            settings  = $.extend({}, settings, options);

            methods.bindListener();
            methods.checkElementsView(data.self);

            return data.self;
        },

        /**
         * Destroys the Plugin
         *
         */
        destroy: function () {
            $(window, document).off(settings.listenTo);
        },

        /**
         * Bind the listeners
         *
         */
        bindListener: function () {
            // Listen on scroll or touchmove
            $(window, document).on(settings.listenTo, function () {
                window.requestAnimationFrame(function () {
					// Scrol Direction watch
					methods.directionWatch();
				
					// Send scroll begin event if not send before
					if ( data.scrolling == false ) 
						methods.onScrollBegin();
					
					// Scrolling event
					methods.onScroll();

                    // Controlls whether elements are in/off view
                    methods.checkElementsView(data.self);

                    // Reset the timer if not scrolling ended
                    clearTimeout(data.timeoutScroll);
                    data.timeoutScroll = null;

                    // Set new timer until scroll ends
                    data.timeoutScroll = setTimeout(function () {
						// Scroll end event
                        methods.onScrollEnd();
                    }, settings.scrollTimeout);
                });
            });
        },
		
		/**
		 * Watch for scroll direction
		 * 
		 */
		directionWatch: function() {
			var scrollTop = methods.getViewportOffset('top');
			
			if ( scrollTop > data.lastScrollPosY ){
				data.direction = 'down';
			} else {
				data.direction = 'up';
			}
			
			data.lastScrollPosY = ( scrollTop <= 0 ) ? 0 : scrollTop; // For Mobile or negative scrolling
		},
		
		/**
		 * Fires the scroll event
		 *
		 * @returns {void}
		 */
		onScroll: function() {
			// Scroll Event
			var scrollEvent = methods.getEventObj(settings.eventNames.scroll);
			
			// Set event data
			if ( data.direction.length > 0 ) {
				scrollEvent = methods.setEventData(scrollEvent, {
					direction: data.direction,
					scrolling: data.scrolling
				});

				// Trigger scroll event
				methods.fireEvent(scrollEvent, $(window, document));
				methods.fireEvent(scrollEvent, $(data.self));
			}
		},
		
		/**
		 * Fires the scroll begin event
		 *
		 * @returns {void}
		 */
		onScrollBegin: function() {
			data.scrolling = true;

			// Set event data
			var beginEvent = methods.setEventData(methods.getEventObj(settings.eventNames.scrollBegin), {
				direction: data.direction,
				scrolling: data.scrolling
			});
			
			methods.fireEvent(beginEvent, $(window,document));
			methods.fireEvent(beginEvent, $(data.self));
		},
		
		/**
		 * Fires the scroll end event and resets values
		 *
		 * @returns {void}
		 */
		onScrollEnd: function() {
			// Turn scrolling watcher off
			data.scrolling = false;
			
			// Scroll OFF Event
			var endEvent = methods.setEventData(methods.getEventObj(settings.eventNames.scrollEnd), {
				direction: data.direction,
				scrolling: data.scrolling
			});
			
			// Reset timers etc
			clearTimeout(data.timeoutDirection);
			data.timeoutDirection = null;
			data.direction = '';

			// Trigger scroll event
			methods.fireEvent(endEvent, $(window,document));
			methods.fireEvent(endEvent, $(data.self));
		},

        /**
         * Checks if elements are in viewport and fires events
         *
         * @param elements
         */
        checkElementsView: function(elements) {
            if ( !elements.length ) {
                return;
            }

            // Get more data
            var viewportSize   = methods.getViewportSize(),
                viewportOffset = methods.getViewportOffset();

            // Return if empty
            if (!viewportOffset || !viewportSize) {
                return;
            }

            // iterate each element and check position
            $(elements).each(function(k, el) {
                // Element positions
                var elementOffset = methods.getElementOffset(el),
                    elementSize   = methods.getElementSize(el, true, settings.respectElementMargin);
				
				// fire only ones the event
				var inview = $(el).data(settings.inviewIdentifier);
				
				// viewport tollerances
                var elOffsetTopTollerance = ( $(el).data(settings.offsetAttrTop) )    ? $(el).data(settings.offsetAttrTop)    : settings.defaultOffset,
                    elOffsetBtmTollerance = ( $(el).data(settings.offsetAttrBottom) ) ? $(el).data(settings.offsetAttrBottom) : settings.defaultOffset;
				
				// viewport decisions
				var elTopIsInViewOfTop    = (elementOffset.top + elOffsetTopTollerance) > viewportOffset.top,
                    elBtmIsInViewOfTop    = (elementOffset.top + elementSize.height - elOffsetTopTollerance) > viewportOffset.top,
                    elTopIsInViewOfBottom = (elementOffset.top + elOffsetBtmTollerance) < (viewportOffset.top + viewportSize.height),
                    elBtmIsInViewOfBottom = (elementOffset.top + elementSize.height + elOffsetBtmTollerance) < (viewportOffset.top + viewportSize.height);

				// check if element already in view
                if ( methods.elementInviewStatus(el) ) {
                    if ( (!elTopIsInViewOfTop && !elBtmIsInViewOfTop) || (!elTopIsInViewOfBottom) ) {
                        methods.elementInviewStatus(el, false);

                        // Fires the OFF VIEW Event for this element
                        methods.fireEvent(methods.setEventData(methods.getEventObj(settings.eventNames.offView), {
                            inview: methods.elementInviewStatus(el)
                        }), el);
                    }
                } else {
                    if ( (elTopIsInViewOfTop && elTopIsInViewOfBottom) || (elBtmIsInViewOfTop && elBtmIsInViewOfBottom) ) {
                        methods.elementInviewStatus(el, true);

                        // Fires the OFF VIEW Event for this element
                        methods.fireEvent(methods.setEventData(methods.getEventObj(settings.eventNames.inView), {
                            inview: methods.elementInviewStatus(el)
                        }), el);
                    }
                }
            });
        },
		
		/**
		 * Set or return the inview status of an element
		 *
		 * @param el
		 * @param onoff
		 * @returns {true|false}
		 */
		elementInviewStatus: function(el, onoff) {
			if ( onoff != undefined ) {
				return $(el).data(settings.inviewIdentifier, onoff);
			} else return $(el).data(settings.inviewIdentifier);
		},

        /**
         * Returns the offset of an DOM element and respects the offset diff options
         *
         * @param element
         * @returns {*|void}
         */
        getElementOffset: function(el) {
			var offsetLeft = 0,
				offsetTop  = 0;
			
			do {
			  if ( !isNaN( el.offsetLeft ) )
				  offsetLeft += el.offsetLeft;
			  
			  if ( !isNaN( el.offsetTop ) )
				  offsetTop += el.offsetTop;
			} while( el = el.offsetParent );
			
			return {top: offsetTop, left: offsetLeft};
            //return $(el).offset();
        },

        /**
         * Returns the size of an DOM element
         *
         * @param element
         * @returns {{width: *, height: *}}
         */
        getElementSize: function(el, outerSize, includeMargin) {
            if ( outerSize ) {
                includeMargin = ( !includeMargin ) ? false : true;

                return {
                    width:  $(el).outerWidth(includeMargin),
                    height: $(el).outerHeight(includeMargin)
                };
            } else {
                return {
                    width:  $(el).width(),
                    height: $(el).height()
                };
            }
        },

		/**
		 * Returns the offset (scroll pos) of the viewport
		 *
		 * @param axys
		 * @returns {*}
		 */
        getViewportOffset: function(axys) {
			var top  = window.pageYOffset || document.documentElement.scrollTop || $(window).scrollTop(),
				left = window.pageXOffset || document.documentElement.scrollLeft || $(window).scrollLeft();
			
            if (axys == 'top') {
                return top;
            } else if (axys == 'left') {
                return left;
            } else return {
                top: top,
                left: left
            };
        },

		/**
		 * Returns the viewport dimensions
		 *
		 * @returns {*}
		 */
        getViewportSize: function() {
            var mode, domObject, size = { height: window.innerHeight, width: window.innerWidth };

            // if this is correct then return it. iPad has compat Mode, so will
            // go into check clientHeight/clientWidth (which has the wrong value).
            if ( !size.height ) {
                mode = document.compatMode;
                if (mode || !$.support.boxModel) { // IE, Gecko
                    domObject = mode === 'CSS1Compat' ?
                        documentElement : // Standards
                        document.body; // Quirks
                    size = {
                        height: domObject.clientHeight,
                        width:  domObject.clientWidth
                    };
                }
            }

            return size;
        },

        /**
         * Creates an new Event Object
         *
         * @param type
         * @returns {w.Event|void}
         */
        getEventObj: function (type) {
            return jQuery.Event(type);
        },

        /**
         * Sets data to an event
         *
         * @param eventObj
         * @param data
         * @returns {*}
         */
        setEventData: function (eventObj, data) {
			// Default event data
			eventObj.scrollfy = {
				direction: data.direction, 
				scrolling: data.scrolling
			};
			
			// Append additional data
			if ( !data ) 
				eventObj.scrollfy = $.extend({}, eventObj.scrollfy, data);
			
            return eventObj;
        },

        /**
         * Triggers an event
         *
         * @param event
         * @param sourceObj
         * @returns {*|void}
         */
        fireEvent: function (eventObj, sourceObj) {
            return $(sourceObj).trigger(eventObj);
        },

        /**
         * Returns the current scroll direction
         *
         * @returns {string}
         */
        getDirection: function() {
            return data.direction;
        }
    };

    // INIT
    return methods.init(options, $(this));
}}(jQuery));
