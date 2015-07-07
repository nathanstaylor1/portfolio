$(document).ready(function(){

	var $window = $(window);
	var win_height_padded = $window.height() * 1.1;
	var isTouch = Modernizr.touch;
	var docHeight = $('footer').offset().top;
	var buffer = 30

	inverseColors()

	function revealOnScroll() {

	     var scrolled = $window.scrollTop();
	     $(".reveal-on-scroll:not(.animated)").each(function () {

	       var $this     = $(this)
	       var offsetTop = $this.offset().top;

	       if (scrolled + win_height_padded > offsetTop) {

	         if ($this.data('timeout')) {

	           window.setTimeout(function(){
	             $this.addClass('animated ' + $this.data('animation'));
	           }, parseInt($this.data('timeout'),10));

	         } else {

	           $this.addClass('animated ' + $this.data('animation'));

	         }

	       }
	     });
	 }

	 function showHideMidDocument() {

	 	var scrolled = $window.scrollTop();

	     $(".show-mid-document").each(function () {
	       var $this = $(this)
	       if (scrolled < buffer || scrolled + win_height_padded > docHeight - buffer) {
	           $this.removeClass('show');
	       }
	     });
	     $(".show-mid-document:not(.show)").each(function () {
	       var $this = $(this)
	       if (scrolled > buffer && scrolled + win_height_padded < docHeight - buffer) {
	           $this.addClass('show');
	       }
	     });

	     $(".hide-mid-document").each(function () {
	       var $this = $(this)
	       if (scrolled > buffer && scrolled + win_height_padded < docHeight - buffer) {
	           $this.removeClass('show');
	       }
	     });
	     $(".hide-mid-document:not(.show)").each(function () {
	       var $this = $(this)
	       if (scrolled < buffer || scrolled + win_height_padded > docHeight - buffer) {
	           $this.addClass('show');
	       }
	     });
	 }

	 function inverseColors(){

	 	var scrolled = $window.scrollTop();

	 	$(".inverse").each(function () {
	 	   var $element = $(this)
	       var elementY = $element.offset().top + ( $element.height() / 2);
	       var elementX = $element.offset().left + ( $element.width() / 2);
	       var light = false;

	       $(".light").each(function () {
	       		var $lightElement = $(this)
	       		var lightElementTop = $lightElement.offset().top;
	       		var lightElementBottom = lightElementTop + $lightElement.height();
	       		var lightElementLeft = $lightElement.offset().left;
	       		var lightElementRight = $lightElement.offset().left + $lightElement.width();


	       		if (elementY >= lightElementTop && 
	       			elementY <= lightElementBottom &&
	       			elementX >= lightElementLeft &&
	       			elementX <= lightElementRight) light = true;

	       });

	       if (light) 
	       	$element.addClass('switch')
	       else 
	       	$element.removeClass('switch')


	 	});

	 }


	 function zoomFrame(){

	 	console.log('working')

	    var _wrapWidth=$('#wrap').width();
	    var _frameWidth=$($('#frame')[0].contentDocument).width();

	    if(!this.contentLoaded)
	      this.initialWidth=_frameWidth;
	    this.contentLoaded=true;
	    var frame=$('#frame')[0];

	    var percent=_wrapWidth/this.initialWidth;

	    frame.style.width=100.0/percent+"%";
	    frame.style.height=100.0/percent+"%";

	    frame.style.zoom=percent;
	    frame.style.webkitTransform='scale('+percent+')';
	    frame.style.webkitTransformOrigin='top left';
	    frame.style.MozTransform='scale('+percent+')';
	    frame.style.MozTransformOrigin='top left';
	    frame.style.oTransform='scale('+percent+')';
	    frame.style.oTransformOrigin='top left';

	    frame.contentWindow.scrollTo(0,100); 
  	};

  	$window.on('resize', zoomFrame)
  	$(".spritewarsFrame").on('load', zoomFrame)


	$window.on('scroll', function(){
		revealOnScroll()
		showHideMidDocument()
		inverseColors()
		setTimeout(inverseColors,800)
	});

	$("#navbarToggle").click(function(){
		$("#navbarToggle").removeClass('show')
		$(".nav-link-holder").addClass('show')

			for (var i = 0; i < 6; i++){
				setTimeout(inverseColors, i * 200)
			}
	});

	$(".circle li").hover(function(){

		var image = $(this).attr("name");
		$("." + image).addClass("show");

	}, function(){

		var image = $(this).attr("name");
		$("." + image).removeClass("show");

	});




});