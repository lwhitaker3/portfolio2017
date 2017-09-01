jQuery(document).ready(function($){
	var introSection = $('#jumbotron-content'),
		introSectionHeight = introSection.height(),
		//change scaleSpeed if you want to change the speed of the scale effect
		scaleSpeed = 0.3,
		//change opacitySpeed if you want to change the speed of opacity reduction effect
		opacitySpeed = 1;

	//update this value if you change this breakpoint in the style.css file (or _layout.scss if you use SASS)
	var MQ = 767;

	triggerAnimation();
	$(window).on('resize', function(){
		triggerAnimation();
    updateNavBar();
	});

	//bind the scale event to window scroll if window width > $MQ (unbind it otherwise)
	function triggerAnimation(){
		if($(window).width()>= MQ) {
			$(window).on('scroll', function(){
				//The window.requestAnimationFrame() method tells the browser that you wish to perform an animation- the browser can optimize it so animations will be smoother
				window.requestAnimationFrame(animateIntro);
			});
		} else {
			$(window).off('scroll');
		}
	}
	//assign a scale transformation to the introSection element and reduce its opacity
	function animateIntro () {
		var scrollPercentage = ($(window).scrollTop()/introSectionHeight).toFixed(5),
			scaleValue = 1 - scrollPercentage*scaleSpeed;
		//check if the introSection is still visible
		if( $(window).scrollTop() < introSectionHeight) {
			introSection.css({
			    '-moz-transform': 'scale(' + scaleValue + ') translateZ(0)',
			    '-webkit-transform': 'scale(' + scaleValue + ') translateZ(0)',
				'-ms-transform': 'scale(' + scaleValue + ') translateZ(0)',
				'-o-transform': 'scale(' + scaleValue + ') translateZ(0)',
				'transform': 'scale(' + scaleValue + ') translateZ(0)',
				'opacity': 1 - scrollPercentage*opacitySpeed
			});
		}
	}

  function updateNavBar() {
    var headroom = nav.data('headroom');
    headroom.offset = nav.offset().top + 40;
    headroom.update();
  }
  window.nav = $("#main-nav");
  nav.headroom({
    // Offset set in updateNavBar.
    "tolerance": 5,
    "classes": {
      "initial": "animated",
      "pinned": "slideDown",
      "unpinned": "slideUp"
    }
  });
  navSticky = new Waypoint.Sticky({
    element: nav[0],
    stuckClass: 'fixed-top',
  });
  updateNavBar();
});

$("#main-nav ul li a[href^='#']").on('click', function(e) {

   // prevent default anchor click behavior
   e.preventDefault();

   // store hash
   var hash = this.hash;

   // animate
   $('html, body').animate({
       scrollTop: $(hash).offset().top
     }, 300, function(){

       // when done, add hash to url
       // (default click behaviour)
       window.location.hash = hash;
     });

});

$('#back-to-top').on('click', function (e) {
    e.preventDefault();
    $('html,body').animate({
        scrollTop: 0
    }, 700);
});

$('.intro-scroll-wrapper').on('click', function (e) {
    e.preventDefault();
		var scrollLength = $('.jumbotron-wrapper').height();
		console.log(scrollLength);
    $('html,body').animate({
        scrollTop: scrollLength
    }, 700);
});

$( ".navbar-toggler" ).click(function() {
	if ($(".navbar-collapse").hasClass("show")){
		$("#nav-icon").removeClass("open");
		$("#primary_navigation").removeClass("background");
		console.log("open");
	} else {
		$("#nav-icon").addClass("open");
		$("#primary_navigation").addClass("background");
		console.log("close");
	}
});
// Process Page

(function($) {

	$(document).ready(function() {
		setupFade();
		setupClickToScroll();
		setupPostAnimation();

    enableScrollAbortion();

		// Trigger window.scroll, this will initiate some of the scripts
		$(window).scroll();
  });


  // Allow user to cancel scroll animation by manually scrolling
  function enableScrollAbortion() {
    var $viewport = $('html, body');
    $viewport.on('scroll mousedown DOMMouseScroll mousewheel keyup', function(e) {
        if ( e.which > 0 || e.type === 'mousedown' || e.type === 'mousewheel') {
             $viewport.stop();
        }
    });
  }

	function setupPostAnimation() {
		var posts = $('.post-wrapper .post');
		$(window).on('scroll resize', function() {

			var currScroll = $(window).scrollTop() > $(document).scrollTop() ? $(window).scrollTop() : $(document).scrollTop(),
				windowHeight = $(window).height(), // Needs to be here because window can resize
				overScroll = Math.ceil(windowHeight*.20),
				treshhold = (currScroll + windowHeight) - overScroll;

			posts.each(function() {

				var post = $(this),
					postScroll = post.offset().top

				if(postScroll > treshhold) {
					post.addClass('hidden');
				} else {
					post.removeClass('hidden');
				}

			});

		});
	}

	function setupFade() {

		var posts = $('.post-wrapper .post').reverse(),
			stemWrapper = $('.stem-wrapper'),
			halfScreen = $(window).height() / 2;

		$(window).on('scroll resize', function() {

			delay(function() {

				var currScroll = $(window).scrollTop() > $(document).scrollTop() ? $(window).scrollTop() : $(document).scrollTop(),
					scrollSplit = currScroll + halfScreen;

				posts.removeClass('active').each(function() {

					var post = $(this),
						postOffset = post.offset().top;

					if(scrollSplit > postOffset) {

						// Add active class to fade in
						post.addClass('active')

						// Get post color
						var color = post.data('stem-color') ? post.data('stem-color') : null,
							allColors = 'color-pink color-orange'

						stemWrapper.removeClass(allColors);

						if(color !== null) {
							stemWrapper.addClass('color-' + color);
						}

						return false;
					}

				});
			}, 20);

		});

	}


	function setupClickToScroll(post) {

		var scrollSpeed = 750;

		$('.post-wrapper .post .stem-overlay .icon').click(function(e) {
			e.preventDefault();

			var icon = $(this),
				post = icon.closest('.post'),
				postTopOffset = post.offset().top,
				postHeight = post.height(),
				halfScreen = $(window).height() / 2,
				scrollTo = postTopOffset - halfScreen + (postHeight/2);

			$('html, body').animate({
				scrollTop: scrollTo
			}, scrollSpeed);
		});

	}

})(jQuery);




/*==========  Helpers  ==========*/


// Timeout function
var delay = (function(){
	var timer = 0;
	return function(callback, ms){
		clearTimeout (timer);
		timer = setTimeout(callback, ms);
	};
})();

$.fn.reverse = function() {
    return this.pushStack(this.get().reverse(), arguments);
};

// End of Process Page

//Resume Page

jQuery(document).ready(function($){
	var timelineBlocks = $('.timeline-block'),
		offset = 0.8;

	//hide timeline blocks which are outside the viewport
	hideBlocks(timelineBlocks, offset);

	//on scolling, show/animate timeline blocks when enter the viewport
	$(window).on('scroll', function(){
		(!window.requestAnimationFrame)
			? setTimeout(function(){ showBlocks(timelineBlocks, offset); }, 100)
			: window.requestAnimationFrame(function(){ showBlocks(timelineBlocks, offset); });
	});


	function hideBlocks(blocks, offset) {
		blocks.each(function(){
			( $(this).offset().top > $(window).scrollTop()+$(window).height()*offset ) && $(this).find('.timeline-img, .timeline-content').addClass('is-hidden');
		});
	}

	function showBlocks(blocks, offset) {
		blocks.each(function(){
			( $(this).offset().top <= $(window).scrollTop()+$(window).height()*offset && $(this).find('.timeline-img').hasClass('is-hidden') ) && $(this).find('.timeline-img, .timeline-content').removeClass('is-hidden').addClass('bounce-in');
		});
	}
});

// Based on https://tympanus.net/codrops/2014/03/27/3d-grid-effect/
/*
 * TODO(creisman):
 *   load content
 *   resize support
 *   history
 */
jQuery(document).ready(function($){
  $('.page-card-grid .page-card-target').on('click', function(e) {
    var wrapper$ = $(e.currentTarget);
    loadContentIntoPage(wrapper$);
    var grid$ = wrapper$.parents('.page-card-grid');
    var content$ = wrapper$.find('.page-card-content').addBack('.page-card-content');
    var clone$ = content$.clone();

    var back$ = $(document.createElement('div'));
    back$.addClass('back');
    back$.html('&nbsp;');

    var placeholder$ = $(document.createElement('div'));
    placeholder$.addClass('placeholder');

    placeholder$.append(clone$);
    placeholder$.append(back$);
    grid$.append(placeholder$);
    wrapper$.addClass('active');

    placeholder$.css(getInitialCardPosition(wrapper$, content$));

    /*
     * Set the new final values after a delay. The delay makes sure the rendering was completed,
     * otherwise the transition wouldn't register for the starting state.
     */
    window.setTimeout(function() {
      var gridOffset = grid$.offset();
      placeholder$.addClass('page-animate-in');
      placeholder$.css({
        /* Offsets from the relative parent to set it at the upper left corner. */
        top: -(gridOffset.top - scrollY),
        left: -(gridOffset.left - scrollX),
        height: document.documentElement.clientHeight,
        width: document.documentElement.clientWidth
      });
    }, 20);

    function showPageContentFn(e) {
      if (e.target == e.currentTarget && e.originalEvent.propertyName == 'transform') {
        placeholder$.off('transitionend', showPageContentFn);
        $('#project-page-content-wrapper').addClass('visible');
        $(document.body).addClass('noscroll');
      }
    }

    placeholder$.on('transitionend', showPageContentFn);
  });

  $('#project-page-content-wrapper .close').on('click', function() {
    $('#project-page-content-wrapper').removeClass('visible');
    var wrapper$ = $('.page-card-grid .page-card-target.active');
    var content$ = wrapper$.find('.page-card-content').addBack('.page-card-content');

    var placeholder$ = $('.page-card-grid .placeholder');

    setTimeout(function() {
      placeholder$.css(getInitialCardPosition(wrapper$, content$));

      $(document.body).removeClass('noscroll');
      placeholder$.removeClass('page-animate-in');

      function destroyPlaceholderFn(e) {
        if (e.target == e.currentTarget && e.originalEvent.propertyName == 'transform') {
          placeholder$.off('transitionend', destroyPlaceholderFn);
          wrapper$.removeClass('active');
          window.setTimeout(function() {
            placeholder$.remove();
          }, 0);
        }
      }

      placeholder$.on('transitionend', destroyPlaceholderFn);
    }, 20);
  });

  function getInitialCardPosition(wrapper$, content$) {
    var gridItem$ = wrapper$.parent();
    var offset = gridItem$.position();

    // Clear the transform so the size calculation is correct.
    content$.css({
      transition: 'none',
      transform: 'none'
    });
    /* Set the initial state to make it overlap the current item. */
    var initialPosition = {
      /* Offsets from the relative parent to match it to the clicked image. */
      top: (offset.top || 0) + parseInt(gridItem$.css('padding-top'), 10),
      left: (offset.left || 0) + parseInt(gridItem$.css('padding-left'), 10),
      height: content$.css('height'),
      width: content$.css('width')
    };
    // Reset the styles.
    content$.css({
      transition: '',
      transform: ''
    });

    return initialPosition;
  }

  function loadContentIntoPage(wrapper$) {
    if (wrapper$.data('pagePath')) {
      $('#project-page-content').load(wrapper$.data('pagePath') + ' #project-page-content');
    }
  }
});

//END OF RESUME PAGE
