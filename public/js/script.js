
//#----Initialize google analytics---#//

  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-65607859-1', 'auto');
  ga('send', 'pageview');




//#---------Image preloader-----------#//

var loader = new PxLoader();
	
	//-define images to load for each page
var indexImages = ['bus.jpg', 'bamboo.jpg', 'computer.jpg', 'clouds.jpg']
var workImages = ['design.jpg', 'work-thumbnails/sirius/main.png']
var playImages = ['night-lights.jpg']
var blogImages = ['textures/cardboard.png']
	
	//-get page name from url
var currentPage = window.location.pathname.substring(1,5)
	
	//select the right images based on page name
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
	//-add images to preloader
currentImages.forEach(function(image){

	var currentImage = loader.addImage("../images/" + image )

})

	//-listen for complete
loader.addCompletionListener(function() { 
	//-add class to hide preloader
	$('body').addClass('loaded');
}); 
	//-start loading images
loader.start(); 


	//- if the image is in cache hide the preloader to prevent page being blocked on back button
window.onpageshow = function(event) {
    if (event.persisted) {
    	$("body").addClass('loaded');
    }
};

//#---------Fix for play/spritewars iframe sizing-----------#//


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


//# --~~<=>--- READY...FIGHT!!! ---<=>~~-- #//


$(document).ready(function(){

    //- fade in the spinner when document is ready.
	$('body').removeClass('nospinner');

	//- make page fade on link click
	$('a').click(function(event) {

		//- get link href
		var href = this.href;

		//- stop ne page loading
	    event.preventDefault();

	    //- fade in preloader
	    $('body').addClass('nospinner')
   		$('body').removeClass("loaded")

   		//-load new page
	    window.location = href;

	});


//#---------Trigger animations on scroll-----------#//

	//-- get window dimensions
	var $window = $(window);
	var win_height_padded = $window.height() * 1.1;
	var isTouch = Modernizr.touch;
	var docHeight = $('footer').offset().top;
	var buffer = 30;


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


//#---------Change navbar colors based on background area-----------#//

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

//#---------Hide navbar and show toggle button mid document-----------#//

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



//---- Function Calls ---//

	inverseColors()

//#-------Event handlers-----------#//
	

	//--resize--//

  	$window.on('resize', function(){		

  		if($('#frame')[0] !== undefined) zoomFrame()

  	});
  	$(".spritewarsFrame").on('load', zoomFrame)


	//--scroll--//

	$window.on('scroll', function(){
		revealOnScroll()
		showHideMidDocument()
		inverseColors()
		$(".img-holder").removeClass("big");
		setTimeout(inverseColors,800)
	});

	//--clicks--//

	$("#navbarToggle").click(function(){
		$("#navbarToggle").removeClass('show')
		$(".nav-link-holder").addClass('show')

			for (var i = 0; i < 6; i++){
				setTimeout(inverseColors, i * 200)
			}
	});

	// view more animations scroll to top of element
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

		//open box
		$(".work-box").removeClass('show');
		$(".work-box." + name).addClass('show');

		// scroll to top of box
		var elementTop = $(".work-box." + name).offset().top - aboveHeight;
		$("html, body").animate({ scrollTop: elementTop }, 1000);
	});

	$(".thumbs .img-holder").click(function(){
		//work page image sizing
		$(this).toggleClass("big");
	})

	//--hovers--//

	//front page circle change background image on hover
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
	

//#--------- Make all blog post links open in new tab ------#//

	$('.blog-post-content a').each(function(){
		$(this).attr("target","_blank");
	})


});