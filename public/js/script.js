
//google analytics
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-65607859-1', 'auto');
  ga('send', 'pageview');


function isInCache(url)
{
  var http = new XMLHttpRequest();
  http.open('HEAD', url, false);
  http.send();
  return http.status;
}


//image preloader
var loader = new PxLoader();

var indexImages = ['bus.jpg', 'bamboo.jpg', 'computer.jpg', 'clouds.jpg']
var workImages = ['design.jpg']
var playImages = ['night-lights.jpg']
var blogImages = ['textures/cardboard.png']

var currentPage = window.location.pathname.substring(1,5)

switch(currentPage){
	case "work":
	var currentImages = workImages;
	break;
	case "play":
	var currentImages = playImages;
	break;
	case "blog":
	var currentImages = blogImages;
	break;
	default:
	var currentImages = indexImages;
	break;
}

currentImages.forEach(function(image){

	var currentImage = loader.addImage("../images/" + image )

})

loader.addCompletionListener(function() { 
	$('body').addClass('loaded');
}); 

loader.start(); 


//check for js on preloader
$(document).ready(function(){
   if (isInCache(window.location.href) == "304") {
        $("body").addClass('loaded');
    }

	$('body').removeClass('nospinner')

	$('a').click(function(event) {

		var href = this.href;

		    event.preventDefault();

		     $('body').addClass('nospinner')
	   		 $('body').removeClass("loaded")

		     window.location = href;

	});


	// animation to trigger on scroll into view
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


	 // for hiding navigation 
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

	 //for chaning golors of navtoggle and navbar based on background color
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

	 // play page spritewars to get right size frame
	 function zoomFrame(){

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


	// hide/show navbar with toggle
	$("#navbarToggle").click(function(){
		$("#navbarToggle").removeClass('show')
		$(".nav-link-holder").addClass('show')

			for (var i = 0; i < 6; i++){
				setTimeout(inverseColors, i * 200)
			}
	});
	$(".view-more-logo").click(function(){

		var name = $(this).attr("id");

		//check if a box is expanded above 
		var foundThis = false;
		var aboveHeight = 50;
		$(".work-box").each(function(){	
			if($(this).hasClass(name )) foundThis = true;
			if($(this).hasClass("show") && !foundThis) {
				aboveHeight += ($(this).height() - 400);
			}
		})

		$(".work-box").removeClass('show');
		$(".work-box." + name).addClass('show');

		var elementTop = $(".work-box." + name).offset().top - aboveHeight;
		$("html, body").animate({ scrollTop: elementTop }, 1000);
	});


	//change background image on hover
	$(".circle li").hover(function(){

		var image = $(this).attr("name");
		$("." + image).addClass("show");

	}, function(){

		var image = $(this).attr("name");
		$("." + image).removeClass("show");

	});

	//work page image sizing
	$(".hover-text").hover(function(){
		var name = $(this).attr("id");
		$("." + name).addClass("big");
	}, function(){
		var name = $(this).attr("id");
		$("." + name).removeClass("big");
	});
	
	$(".thumbs .img-holder").click(function(){
		$(this).toggleClass("big");
	})

	$window.on("scroll",function(){
		$(".img-holder").removeClass("big");
	})


	$('.blog-post-content a').each(function(){
		$(this).attr("target","_blank");
	})



});