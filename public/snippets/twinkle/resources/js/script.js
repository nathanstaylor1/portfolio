var starGroups = []
var maxStarSize = 2.5;
var minStarSize = .5;
var numberOfGroups = 20;

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
	
  addStars(500, $(".sky"))

  setInterval(function(){
    twinkle()
  },100);

});
