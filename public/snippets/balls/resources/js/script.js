

function Ball(diameter, color, x, y, Xvel, Yvel){

    this.diameter = diameter;
   	this.color = color;
	this.x = x;
	this.y = y;
	this.Xvel = Xvel || Math.random()*40 -20
	this.Yvel = Yvel || 0;

    $("body").append("<div class = 'ball'></div>");
    this.$DOM =	$("body div:last-child")
	this.$DOM.width(diameter).height(diameter).css("border-radius",diameter)
	this.$DOM.css("background-color",color).css("left",x).css("top",y)
} 


function fall(obj){
			obj.y += obj.Yvel
			obj.$DOM.css("top",obj.y)
            obj.Yvel += 0.5	

};

function fly(obj){
			obj.x += obj.Xvel 
			obj.$DOM.css("left",obj.x)
}

function split(obj){

	var docWidth = $(document).width()
	var docHeight = $(document).width()


	if (obj.diameter > 35){
	    var split1 = new Ball(obj.diameter/1.5, obj.color, obj.x, docWidth -obj.diameter/2, obj.Xvel*spread(0.7,1.3), obj.Yvel*spread(0.6,0.8))
	    var split2 = new Ball(obj.diameter/1.5, obj.color, obj.x, docWidth -obj.diameter/2, obj.Xvel*spread(0.7,1.3), obj.Yvel*spread(0.6,0.8))
	}
	obj.$DOM.remove()

	move(split1)
	move(split2)
}


function move(obj){

	var docWidth = $(document).width()
	var docHeight = $(document).width()

	obj.moveInterval = setInterval(function(){
		
		if (obj.y + obj.diameter >= docHeight) {

			if (Math.random()>0.3){
			   clearInterval(obj.moveInterval)
			   split(obj)
			}else{
			   obj.Yvel = -obj.Yvel*0.6
			   obj.y = docHeight -obj.diameter ;
			}

		}
		if (obj.x < 0) {

			obj.Xvel = -obj.Xvel*0.8;
			obj.x = 0;
		}
		if (obj.x + obj.diameter > docWidth) {
			obj.Xvel = -obj.Xvel*0.8
			obj.x = docWidth -obj.diameter ;
		}

		fall(obj)
		fly(obj)
	},50);

}

function randomColor(){
 var color = "#"
 var choices = [1,2,3,4,5,6,7,8,9,0,"A","B","C","D","E","F"]
  
 for (i=0; i < 6; i++){
  	color += choices[Math.round(Math.random()*15)]
 };
 return color;
}

function spread(low,high){
	return low + Math.random()*(high-low) 
}

$(document).ready(function(){

	var docWidth = $(document).width()
	var docHeight = $(document).width()

	setInterval(function(){
		var current_ball = new Ball(spread(50,100), randomColor(), spread(100,docWidth-100), -100)
		move(current_ball)
	},3000);

});

