jQuery(document).ready(function($){
	var introSection = $('#jumbotron-content'),
		introSectionHeight = introSection.height(),
		//change scaleSpeed if you want to change the speed of the scale effect
		scaleSpeed = 0.3,
		//change opacitySpeed if you want to change the speed of opacity reduction effect
		opacitySpeed = 1;

	//update this value if you change this breakpoint in the style.css file (or _layout.scss if you use SASS)
	var MQ = 1170;

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
    console.log("Updated: " + headroom.offset);
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

//END OF RESUME PAGE
