var starGroups = []
var maxStarSize = 5;
var minStarSize = 1
var numberOfGroups = 20

function StarGroup(num){
  this.number = num

  this.size = minStarSize + Math.random()*maxStarSize
  this.phase = Math.random()
  this.twinkleSpeed = 0.05 +Math.random()*0.05
  this.growing = Math.random() > 0.5 ? true : false;

  starGroups.push(this)
}

for (var i = 1; i <= numberOfGroups; i++){
  new StarGroup(i)
}

function Star(maxX,maxY){
  this.x = Math.random() * maxX
  this.y = Math.random() * maxY;

  this.group = 1 + Math.floor(Math.random() * numberOfGroups)
  this.DOM = $(".stars p:last-child")

  $(".stars").append("<p class = 'starGroup" + this.group + "''>✦</p>")


  this.DOM.css("left", this.x + "px")
  this.DOM.css("top", this.y + "px")

}

StarGroup.prototype.update = function(){

    if (this.phase > 1 || this.phase < 0) this.growing = !this.growing

    if (this.growing){
      this.phase += this.twinkleSpeed;
    } else {
      this.phase -= this.twinkleSpeed;
    }

    $(".starGroup" + this.number).css("font-size", this.size * this.phase + "px")

}

function addStars(num,dom){
  dom.append("<div class = 'stars'></div>")
  for (var i = 0; i < num ; i++){
    new Star(dom.width(), dom.height())
  }
}

function twinkle(){
  starGroups.forEach(function(starGroup){
    starGroup.update()
  });
}

$(document).ready(function(){
	
	addLipsum()

  //addStars(1000, $(".sky"))

  setInterval(function(){
    twinkle()
  },100);

});


//-------- HELPER FUNCTIONS -------//
function spread(low,high){
  return (low + Math.floor(Math.random()*(high-low)))
}

function lipsum(num){
  var words = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a".split(" ")
  var output = ""
  for (var i = 0; i < num; i++){
    output += words[spread(0,100)] + " "
  }
  output = output[0].toUpperCase() + output.substring(1,output.length)
  return output
}

function addLipsum(){
  $('body *').each(function(){                                                                                                                                                                                                                                                         
      if ($(this).hasClass("LE")){
      var classList = $(this).attr('class').split(" ");
        for (i = 0; i < classList.length; i++){
          if (!isNaN(classList[i])){
            $(this).html($(this).html() + lipsum(classList[i]));
          }
        } 
      }                                                                                                                                     
  });
}

function fillEach(selector,htmlFunction){
  $(selector).each(function(i, obj) {
    $(this).html(htmlFunction)
  });
}