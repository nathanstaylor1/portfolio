"use strict";

// -------------------------------- CONFIG VARIABLES ----------------------------- //

var renderHitboxes = false;
var drawGrid = false;

var faceIconSize = 40;
var weaponIconSize = 36;
var ammoSize = 22;

var crateGenerationRate = 8;

var xfudge = 0.96;

// ----------------------------- DRAWING MAP --------------------------------///

var Xscale = 50;
var Yscale = 25;

// tile types //

function Brick(pos){
    this.wall = true;
    this.classDisplay = "brick";
    this.spriteIndex = {
        "x": ["topBrickCenter","topBrickCenter"],
        "o": ["centerBrickCenter","centerBrickCenter"],
        "s": ["topBrickLeft","topBrickRight"],
        "v": ["topBrickLeft","topBrickCenter"],
        "n": ["topBrickCenter","topBrickRight"],
        "i": ["centerBrickLeft","centerBrickCenter"],
        "p": ["centerBrickCenter","centerBrickRight"] 
    };
}
function Air(){
    this.wall = false;
    this.classDisplay = "blank";
    this.spriteIndex = {
        " ": ["blank","blank"]
    };
}
function Grass(){
    this.wall = true;
    this.classDisplay = "grass";
    this.spriteIndex = {
        "g": ["centerGrass","centerGrass"],
        "l": ["leftGrass","centerGrass"],
        "r": ["centerGrass","rightGrass"]
    };
}
function Dirt(){
    this.wall = true;
    this.classDisplay = "dirt";
    this.spriteIndex = {
        "d": ["dirt1","dirt2"]
    };
}


var mapChars = {
    "x": Brick, "o": Brick, "v": Brick, "n": Brick, "s": Brick, "i": Brick, "p": Brick,
    " ": Air,
    "g": Grass, "l": Grass, "r": Grass,
    "d": Dirt
};

var mapSpritesIndex = {
    blank:0, 
    topBrickCenter:1, 
    topBrickLeft:2, 
    topBrickRight:3, 
    centerBrickCenter:4, 
    centerBrickLeft:5, 
    centerBrickRight:6, 
    centerGrass:7, 
    rightGrass:8, 
    leftGrass:9, 
    dirt1:10,
    dirt2:11}

var tmpl = [[" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
            [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
            [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
            [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
            [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
            [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
            [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
            [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
            [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
            [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
            [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
            [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
            [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
            [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
            [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
            [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
            [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
            [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
            [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
            ["d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d"]]

var map1 = [[" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
            [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
            [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
            [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
            [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
            [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
            [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
            [" "," "," "," ","v","n"," ","v","n"," ","v","n"," "," "," "," "],
            [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
            [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
            [" "," "," ","s"," "," "," "," "," "," "," "," ","s"," "," "," "],
            [" "," "," "," "," "," "," ","v","n"," "," "," "," "," "," "," "],
            [" "," "," "," "," "," ","v","o","o","n"," "," "," "," "," "," "],
            [" "," ","s"," "," "," "," ","i","p"," "," "," "," ","s"," "," "],
            [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
            [" "," "," "," ","v","x","x","x","x","x","x","n"," "," "," "," "],
            ["g","r"," "," "," "," "," "," "," "," "," "," "," "," ","l","g"],
            ["d","d","r"," "," "," "," "," "," "," "," "," "," ","l","d","d"],
            ["d","d","d","l","g","g","g","g","g","g","g","g","r","d","d","d"],
            ["d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d"]]

var map2 = [[" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
            [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
            [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
            [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
            [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
            [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
            [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
            [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
            ["r"," "," "," "," ","s"," ","s"," ","s"," ","s"," ","s"," "," "],
            ["d","r"," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
            ["d","d","r"," "," "," "," "," "," "," "," "," "," "," "," "," "],
            ["d","d","d","r"," "," "," "," "," "," "," "," "," "," "," "," "],
            ["d","d","d","d","r"," "," "," "," "," "," "," "," "," "," "," "],
            ["d","o","o","o","d","r"," "," "," "," "," "," "," "," "," "," "],
            ["p","o","o","o","p","d"," "," "," "," "," "," "," "," "," "," "],
            ["o"," "," "," ","o","d","l","g","g","g","g","g","g","r"," "," "],
            ["o"," "," "," ","i","o","o","o","o","o","o","o","o","p"," ","l"],
            ["o"," ","s"," "," "," "," "," "," "," "," "," "," "," "," ","d"],
            ["o"," ","o"," "," "," "," "," "," "," "," "," "," "," "," ","d"],
            ["i","v","o","x","x","x","x","x","x","x","x","x","x","x","n","d"]]

var map3 = [[" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
            [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
            [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
            [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
            [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
            [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
            [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
            [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
            [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
            [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
            [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
            [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
            [" "," "," "," ","v","n"," "," "," "," ","v","n"," "," "," "," "],
            [" "," "," ","l","p"," "," "," "," "," "," ","i","r"," "," "," "],
            [" "," ","l","o"," "," "," "," "," "," "," "," ","i","r"," "," "],
            [" ","l","d","i"," "," "," ","v","n"," "," "," ","o","d","r"," "],
            ["l","d","o"," "," "," ","s"," "," ","s"," "," "," ","i","d","r"],
            ["d","i"," "," "," "," "," "," "," "," "," "," "," "," ","o","d"],
            ["d","o"," "," "," "," "," "," "," "," "," "," "," "," ","o","d"],
            ["d","p","v","x","x","x","x","x","x","x","x","x","x","x","i","d"]]

var map4 = [[" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
            [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
            [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
            [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
            [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
            [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
            [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
            [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
            [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
            [" "," "," "," ","s"," "," ","v","n"," "," ","s"," "," "," "," "],
            [" "," "," ","s"," "," "," ","i","p"," "," "," ","s"," "," "," "],
            [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
            [" ","s"," "," "," "," "," "," "," "," "," "," "," "," ","s"," "],
            [" "," "," "," "," "," "," "," "," "," "," "," "," "," "," "," "],
            [" "," "," "," "," "," "," ","v","n"," "," "," "," "," "," "," "],
            ["s"," "," "," "," "," "," ","o","i"," "," "," "," "," "," ","s"],
            ["i"," "," "," "," "," "," ","p","o"," "," "," "," "," "," ","i"],
            ["o"," "," "," "," "," "," "," "," "," "," "," "," "," "," ","i"],
            ["p","l","g","g","g","g","g","p","o","g","g","g","g","g","r","o"],
            ["o","d","d","d","d","d","d","i","o","d","d","d","d","d","d","p"]]

// -------------------------------- LEVEL GENERATION ----------------------------- //

function Level(DOM, map){

    DOM.append("<div id = 'level'><div id = 'background'></div><div id = 'actors'></div><div id = 'attacks'></div><div id = 'hitboxes'></div><div id = 'HUD'></div></div>")
    this.$DOM = $("#level")
    this.actors = []
    this.gravityForce = 20;
    this.frameRate = 1000/8;
    this.frameCount = 0;
    this.updateFrame = false;
    this.nextCrateIn = crateGenerationRate;
}

Level.prototype.init = function(map){
    this.drawHUD()
    this.drawMap(map)
    this.updateHUD()
}

Level.prototype.drawHUD = function(){

    this.$HUD = $("#HUD")

    var HUDforEachPlayer = "<div class = 'faceIcon'></div>" +
                           "<div class = 'healthBarOuter'><div class = 'healthBarInner'></div></div>"+
                           "<div class = 'weapons'><img class = 'left'><img class = 'selected'><img class = 'right'></div>"+
                           "<div class = 'ammo'><img class = 'left'><img class = 'right'></div>"

    this.HUDspriteIndex = {
        faceIcons: {"nathan":0, "yuriko":1, "rina":2},
        weaponIcons: {"knife":0, "bowl":1, "star":2, "fist":3, "fork":4, "fireball": 5, "boomerang":6, "mine":7}
    }

    var shift = 0;
    var players = ["P1", "P2"]

    for (var p = 0; p < players.length; p++){

        var player = players[p]

		this.$HUD.append("<div id = '" + player + "'>" + HUDforEachPlayer + "</div>")

        this[player + "sprites"] = {
        faceIcons: new Spritesheet("/snippets/spritewars/resources/images/faceIcons.png", 20, 20, "#" + player + " .faceIcon", faceIconSize, faceIconSize),
        weaponIcons: new Spritesheet("/snippets/spritewars/resources/images/weaponIcons.png", 16, 16, "#" + player + " .weapons .selected", weaponIconSize, weaponIconSize),
        numbersLeft: new Spritesheet("/snippets/spritewars/resources/images/numbersLeft.png", 6, 11, "#" + player + "  .ammo .left", ammoSize/2, ammoSize),
        numbersRight: new Spritesheet("/snippets/spritewars/resources/images/numbersRight.png", 6, 11, "#" + player + "  .ammo .right", ammoSize/2, ammoSize)
   		}

        shift = this.HUDspriteIndex.faceIcons[this[player].name]*faceIconSize
        this[player +"sprites"].faceIcons.clipTo(0, shift + faceIconSize, faceIconSize, shift)

    }

}

Level.prototype.updateHUD = function(){


    var players = ["P1", "P2"]

    for (var p = 0; p < players.length; p++){

        var player = players[p]

        // update health
        var health = this[player].HP/this[player].maxHP * 200
        $("#" + player + " .healthBarInner").css("width", health)

        //update weapons
        var shift = this.HUDspriteIndex.weaponIcons[this[player].getCurrentWeapon().name]*weaponIconSize
        this[player + "sprites"].weaponIcons.clipTo(0, shift + weaponIconSize, weaponIconSize, shift)

        //update ammo
        var currentAmmo = this[player].getCurrentAmmo().toString()
        if (currentAmmo.length == 1) currentAmmo = "0" + currentAmmo

        shift = currentAmmo[0] * ammoSize / 2
        this[player + "sprites"].numbersLeft.clipTo(0, shift + ammoSize / 2, ammoSize, shift)

        shift = currentAmmo[1] * ammoSize / 2
        this[player + "sprites"].numbersRight.clipTo(0, shift + ammoSize / 2, ammoSize, shift)
    }

}

Level.prototype.drawMap = function(map){

    $("#background").append("<table id = 'map'></table>")
    var $map = $("#map")

    if (drawGrid){
        $("body").append("<table id = 'grid'></table>")
        var $grid = $("#grid")    
    }

    var mapWidth = map[0].length
    var mapHeight = map.length

    this.width = mapWidth*Xscale
    this.height = mapHeight*Yscale

    var col = 0;
    var row = 0;

    var tileType = {}
    this.grid = []

    for (row; row < mapHeight; row++){

        $map.append("<tr class = 'row" + row + "'></tr>")
        if (drawGrid) {
            $grid.append("<tr></tr>")
            $gridRow = $("#grid tr:last-child")
        }
        this.grid[row] = []

        for (col; col < mapWidth; col++){

            tileType = {}
            tileType = new mapChars[map[row][col]]
            $(".row" + row).append("<td class = '" + tileType.classDisplay + "'></td>")    

            var spriteCombo = tileType.spriteIndex[map[row][col]]

            for (var i = 0; i < 2; i++){

	            var mapSprite = new Spritesheet("/snippets/spritewars/resources/images/mapTerrain.png", 25, 25, ".row" + row + " td:last-child", (Xscale + 2)/2, (Yscale + 1 ))
	           
	            var shift = mapSpritesIndex[spriteCombo[i]]* (Xscale + 2)/2 

	            mapSprite.clipTo(0, shift + Xscale/2, Yscale, shift)
	            mapSprite.$img.css("left", col * Xscale * xfudge - shift + Xscale/2 * i)

	            if (tileType.classDisplay == "blank")  mapSprite.$img.css("opacity",0)

        	}

            if (drawGrid) $gridRow.append("<td></td>")
            this.grid[row].push(tileType)

        }
        col = 0
    }

    $("#map td").css("width", Xscale + "px")
    $("#map td").css("height", Yscale + "px")

}


function Item(content, amount) {

    this.type = "item"
    this.content = content;
    this.amount = amount;
    this.hitBox = new Rectangle(new Vector(0, 0),new Vector(20, 20))

    if (renderHitboxes){

        $("#hitboxes").append("<div class = 'crate hitbox'></div>")
        this.$hitBox = $("#hitboxes div:last-child")
        this.$hitBox.css("width",this.hitBox.BR.x - this.hitBox.TL.x + "px")
        this.$hitBox.css("height",this.hitBox.BR.y - this.hitBox.TL.y   + "px")
    }


}

Item.prototype.generate = function(pos, level){

    this.pos = pos;
    level.actors.push(this)
    $("#actors").append("<div class = 'item'></div>")
    this.spritesheet = new Spritesheet("/snippets/spritewars/resources/images/itemIcons.png", 16, 16, "#actors .item:last-child", 20, 20)
    this.$DOM = $("#actors .item:last-child")

    var shift = itemSpritesIndex[this.content]* 20
    this.spritesheet.clipTo(0,shift + 20, 20, shift)

}

Item.prototype.act = function(step, level){

    var otherActor = level.actorAt(this)

    if (otherActor && otherActor.type == "character"){
        otherActor.pickUp(this)
        this.removeMe(level)
    }

}

Item.prototype.removeMe = function(level){
    
    this.$DOM.remove()
    level.actors.forEach(function(actor, index){
        if (actor == this) var removedItem = level.actors.splice(index, 1)
       	if (renderHitboxes && removedItem) removedItem[0].$hitBox.remove()
    }, this)

}

Item.prototype.draw = function(level){
    this.$DOM.css("left",this.pos.x * xfudge)
    this.$DOM.css("top",this.pos.y)

	level.renderHitboxOf(this)
}
    
function Crate(pos, item){
    this.type = "crate"
    this.pos = pos;
    this.size = new Vector(30,30)
    this.speed = new Vector(0,0)
    this.item = item;
    this.hitBox = new Rectangle(new Vector(0, 5),new Vector(30, 25))

    $("#actors").append("<div class = 'crate'></div>")
    this.spritesheet = new Spritesheet("/snippets/spritewars/resources/images/crate.png", 25, 25, "#actors .crate:last-child", 30, 30)
    this.$DOM = $("#actors .crate:last-child")

    if (renderHitboxes){

        $("#hitboxes").append("<div class = 'crate hitbox'></div>")
        this.$hitBox = $("#hitboxes div:last-child")
        this.$hitBox.css("width",this.hitBox.BR.x - this.hitBox.TL.x + "px")
        this.$hitBox.css("height",this.hitBox.BR.y - this.hitBox.TL.y   + "px")
    }

}

Crate.prototype.act = function(step, level){
    this.speed.y = level.gravityForce/5
    this.speed.x = 0
    var newPos = new Vector(this.pos.x + this.speed.x, this.pos.y + this.speed.y)

    var obstacle = level.obstacleAt(newPos, this.hitBox)

    if (!obstacle){
        this.pos = newPos
    }

}

Crate.prototype.draw = function(level){
    this.$DOM.css("left",this.pos.x * xfudge)
    this.$DOM.css("top",this.pos.y)

	level.renderHitboxOf(this)
}

Crate.prototype.breakMe = function(level){
    this.item.generate(this.pos, level)
    this.$DOM.remove()
    level.actors.forEach(function(actor, index){
        if (actor == this) var removedCrate = level.actors.splice(index, 1)
        if (renderHitboxes && removedCrate) removedCrate[0].$hitBox.remove()
    }, this)

}

Level.prototype.generateCrates = function(step){

	this.nextCrateIn -= step;

	if (this.nextCrateIn < 0){
	    this.nextCrateIn = crateGenerationRate;

	    var itemIn = items[Math.floor(Math.random() * items.length)]
	    var crate = new Crate(new Vector(Math.floor(Math.random()*15*Xscale),10),new Item(itemIn[0], itemIn[1]) )
	    this.actors.push(crate)
	}

}

Level.prototype.renderHitboxOf = function(actor){
	if (renderHitboxes){
        actor.$hitBox.css("left",this.pos.x * xfudge + this.hitBox.TL.x + "px")
        actor.$hitBox.css("top",this.pos.y + this.hitBox.TL.y  + "px")
    }
}

Level.prototype.obstacleAt = function(pos, hitBox){

  var xStart = Math.floor((pos.x + hitBox.TL.x) / Xscale);
  var xEnd = Math.ceil((pos.x + hitBox.BR.x) / Xscale);
  var yStart = Math.floor((pos.y + hitBox.TL.y) / Yscale);
  var yEnd = Math.ceil((pos.y + hitBox.BR.y) / Yscale);


  if (xStart < 0 || xEnd > this.width/Xscale || yStart < 0)
    return true;
  if (yEnd > this.height/Yscale)
    return true;
  for (var y = yStart; y < yEnd; y++) {
    for (var x = xStart; x < xEnd; x++) {
      var tileType = this.grid[y][x];
      if (tileType) {
          if (tileType.wall) return tileType
      }
    }
  }
};


Level.prototype.actorAt = function(actor, excluding) {

  var excludingArray = []

  if(excluding && excluding.constructor === Array) var excludingArray = excluding

  for (var i = 0; i < this.actors.length; i++) {

    var other = this.actors[i];

    if (other != actor && other != excluding && excludingArray.indexOf(other) == -1 &&
        actor.pos.x + actor.hitBox.BR.x > other.pos.x + other.hitBox.TL.x &&
        actor.pos.x + actor.hitBox.TL.x < other.pos.x + other.hitBox.BR.x &&
        actor.pos.y + actor.hitBox.BR.y > other.pos.y + other.hitBox.TL.y &&
        actor.pos.y + actor.hitBox.TL.y < other.pos.y + other.hitBox.BR.y )
      return other;
  }
};


var maxStep = 0.08;

Level.prototype.animate = function(step){

    while (step > 0) {
        var thisStep = Math.min(step, maxStep)

        this.frameCount += step*1000
        if (this.frameCount >= this.frameRate){
            this.updateFrame = true;
            this.frameCount -= this.frameRate;
        }
        this.actors.forEach(function(actor){
            actor.act(thisStep, this);
            actor.draw(this)
        }, this)

        this.updateHUD()
        this.updateFrame = false;
        this.generateCrates(step)
    step -= thisStep;

    }
};
// -------------------------------- VECTORS ----------------------------- //

function Vector(x,y){
    this.x = x;
    this.y = y;
}

Vector.prototype.plus = function(other){
    return new Vector(this.x + other.x, this.y + other.y)
}

Vector.prototype.times = function(factor){
    return new Vector(this.x * factor, this.y * factor)
}

function Rectangle(TL,BR){
    this.TL = TL;
    this.BR = BR;
}

// -------------------------------- SPRITESHEET ----------------------------- //

function Spritesheet(dir, frameWidth, frameHeight, wrap, displayWidth, displayHeight ){

    this.image = new Image()

    this.$DOM = $(wrap)
    this.$DOM.append(this.image)
	this.$img = $(wrap + " img:last-child")

    var scope = this;

    this.image.onload = function(event){

		this.totalFrames = Math.floor(this.naturalWidth / frameWidth)   

		scope.$img.css("width", displayWidth * this.totalFrames)
		scope.$img.css("height", displayHeight)

    }

    this.image.src = dir;

}

Spritesheet.prototype.putInto = function(selector){

    $(selector).append(this.image)
    this.$img = $(selector + " img:last-child")

}

Spritesheet.prototype.clipTo = function(top,right,bottom,left){

    if (this.$img){
        this.$img.css("clip", "rect(" + top + "px, " + right + "px, " + bottom + "px, " + left + "px)")        
        this.$img.css("left", -left + "px")

    } else {
        throw "no DOM element to clip"
    }

}

// -------------------------------- CHARACTERS ----------------------------- //

function Character(name, spritesheetSRC, keys, pos, size, level){

    this.type = "character"
    this.name = name;
    this.keys = keys;
    this.pos = pos;
    this.speed = new Vector(0,0)
    this.spritesheetBuffer = new Vector(0,0)
    this.size = size;
    this.hitBox = new Rectangle(new Vector(size.x * 0.2, 0),new Vector(size.x * 0.8, size.y))

    this.maxHP = 100;
    this.HP = this.maxHP;
    this.dead = false;

    this.defence = 10;

    this.frame = 0;
    this.facing = "left"
    this.airborne = true;
    this.attacking = false;
    this.gotHit = false;
    this.knockbackForce = 0;
    this.attacks = [];
    this.attackTime = 0;


    this.weapons = [["fist","00"]]
    this.currentWeaponIndex = 0;
    this.weaponChanged = false;

    this.getCurrentWeapon = function(){
        return weaponList[this.weapons[this.currentWeaponIndex][0]]
    }

    this.getCurrentAmmo = function(){
        return this.weapons[this.currentWeaponIndex][1]
    }

    this.moveSpeed = 200;
    this.jumpHeight = 9;

    level.actors.push(this)

    $("#actors").append("<div id = '" + name + "'><img></div>")
    this.$DOM = $("#actors div:last-child")

    //drawing hitbox

    if (renderHitboxes){

        $("#hitboxes").append("<div class = 'character hitbox'></div>")
        this.$hitBox = $("#hitboxes div:last-child")
        this.$hitBox.css("width",this.hitBox.BR.x - this.hitBox.TL.x + "px")
        this.$hitBox.css("height",this.hitBox.BR.y - this.hitBox.TL.y   + "px")

    }

    var displayWidth = 

    this.spritesheet = new Spritesheet(spritesheetSRC, 24, 24, "#actors div:last-child", size.x, size.y)

    this.spritesheet.$img.css("clip", "rect(0px, " + size.x + "px, " + size.y + "px, 0px)")

    this.walkFrames = [0,1];
    this.jumpFrames = [2];
    this.attackFrames = [3];
    this.airAttackFrames = [4];
    this.gotHitFrames = [5]
    this.deadFrames = [6]

}

Character.prototype.draw = function(level){

	level.renderHitboxOf(this)

    this.$DOM.css("left", this.pos.x * xfudge + this.spritesheetBuffer.x + "px")
    this.$DOM.css("top", this.pos.y + this.spritesheetBuffer.y  + "px")


}

Character.prototype.moveX = function(step, level){

    this.speed.x = this.knockbackForce;
    this.knockbackForce /=1.2;

    var groundAttack = !this.airborne && (this.attacking || this.keys.attack[1])

    if     (this.keys.left[1] && !groundAttack && !this.dead ){    
        this.speed.x -= this.moveSpeed
        this.facing = "left"
    }
    if(this.keys.right[1] && !groundAttack && !this.dead){
        this.speed.x += this.moveSpeed
        this.facing = "right"
    }

    var newPos = this.pos.plus(new Vector(this.speed.x * step, 0))

    var otherActor = level.actorAt(this, this.attacks)
    var obstacle = level.obstacleAt(newPos, this.hitBox);

    if ((!otherActor || this.gotHit) && !obstacle) {
        this.pos = newPos
    } else if (otherActor && (otherActor.type == "character" || otherActor.type == "crate")) {
        var otherDirection = this.pos.plus(this.size.times(0.5)).plus(otherActor.pos.plus(otherActor.size.times(0.5)).times(-1))
        var pushDirection = otherDirection.x / Math.abs(otherDirection.x)
        this.speed.x += pushDirection * this.moveSpeed
        newPos = this.pos.plus(new Vector(this.speed.x * step, 0))
        obstacle = level.obstacleAt(newPos, this.hitBox);
        if (!obstacle) this.pos = newPos
    }
}

Character.prototype.moveY = function(step, level){

    this.speed.y += level.gravityForce * step

    var newPos = this.pos.plus(new Vector(0, this.speed.y))

     var obstacle = level.obstacleAt(newPos, this.hitBox);

    if (!obstacle) {
        this.pos = newPos
        this.airborne = true;
    } else if (this.speed.y > 0){
        this.airborne = false;
        this.speed.y = 0;
        this.gotHit = false;
        //this.pos.y = Math.floor((this.pos.y + this.hitBox.BR.y) / Yscale) * Yscale - this.size.y;
        if (this.keys.jump[1] && !this.attacking && !this.dead) this.speed.y = -this.jumpHeight
    } else {
        this.speed.y = 0;
        //this.pos.y = Math.floor((this.pos.y + this.hitBox.TL.y) / Yscale) * Yscale + this.size.y;
        this.airborne = true;
    }
}

Character.prototype.attack = function(step, level){

    if (this.keys.weaponLeft[1] && !this.weaponChanged){

        this.currentWeaponIndex = (this.currentWeaponIndex - 1 + this.weapons.length) % this.weapons.length
        this.weaponChanged = true;

    } else if(this.keys.weaponRight[1] && !this.weaponChanged){

        this.currentWeaponIndex = (this.currentWeaponIndex + 1) % this.weapons.length
        this.weaponChanged = true;
    }

    if (!this.keys.weaponLeft[1] && !this.keys.weaponRight[1]) {
        this.weaponChanged = false;
    }

    if (this.keys.attack[1] && !this.attacking && !this.dead){
        this.attacking = true;
        this.attackTime = 0;
        if (this.getCurrentAmmo() > 0 || !this.getCurrentWeapon().projectile) {
            var thisAttack = new Attack(this.getCurrentWeapon(), this )
            this.attacks.push(thisAttack)
            level.actors.push(thisAttack)
            if (this.getCurrentWeapon().projectile) this.weapons[this.currentWeaponIndex][1]--
        } else {
            this.weapons.splice(this.currentWeaponIndex,1)
            this.currentWeaponIndex = 0
        }
    }

    if (this.attacking){

        this.attackTime += step

        if (this.attackTime >= this.getCurrentWeapon().attackTime){
            this.attacking = false;
        }
    }
}

Character.prototype.pickUp = function(item){

    var taken = false;

    if (item.content == "health"){
        this.HP += item.amount;
        if (this.HP > this.maxHP) this.HP = this.maxHP;
        taken = true;
    } else {

        for (var w = 0; w < this.weapons.length; w++){

            if (this.weapons[w][0] == item.content){
                taken = true;
                this.weapons[w][1] += item.amount
            }
        }
        
        if (!taken) {
            this.weapons.push([item.content, item.amount])
            this.currentWeaponIndex = this.weapons.length - 1
        } 
    }
}

Character.prototype.changeFrame = function(step, level){

    if (level.updateFrame){

        var frameType = ""

        if (this.dead){ frameType = "deadFrames"
        } else if (this.gotHit){ frameType = "gotHitFrames"
        }  else if (this.attacking){
            if (this.airborne){
                frameType = "airAttackFrames"
            } else {
                frameType = "attackFrames"
            }
        } else if (this.airborne){
                frameType = "jumpFrames"
        } else {        
            frameType = "walkFrames"
            if (!this.keys.left[1] && !this.keys.right[1]) this.frame = 0    
        }

        var currentFrame = this.frame % this[frameType].length
        var left = this[frameType][currentFrame] * this.size.x;
        var right = left + this.size.x

        //find the right frame and clip the img and move to the right position.

        if (this.facing == "left"){
            this.spritesheetBuffer.x = -left
            this.spritesheet.$img.css("transform", "scaleX(1)")
        } else if ((this.facing == "right")){
            this.spritesheetBuffer.x = right - this.spritesheet.image.width
            this.spritesheet.$img.css("transform", "scaleX(-1)")
        }

        this.spritesheet.$img.css("clip", "rect(0px, " + right + "px, " + this.size.y + "px, " + left + "px)")
        this.frame++
    }
}


Character.prototype.act = function(step, level){
    this.moveX(step, level)    
    this.moveY(step, level)
    this.attack(step, level)
    this.changeFrame(step, level)    
}

//    -------------------------------------  WEAPONS   ------------------------------------------- //


function Weapon(name, hitBox, damage, knockback, speed, attackTime, projectile, applyGravity, sprites){
    this.name = name;
    this.hitBox = hitBox;
    this.damage = damage;
    this.knockback = knockback;
    this.speed = speed;
    this.attackTime = attackTime;
    this.projectile = projectile;
    this.applyGravity = applyGravity;
    this.sprites = sprites;
    weaponList[this.name] = this
    allWeapons.push([this.name, "99"])

}

var weaponList = {}
var allWeapons = []

var fistHitBox = new Rectangle(new Vector(0, 30),new Vector(10, 40))
var fist = new Weapon("fist", fistHitBox, 50, 500, new Vector(0,0), 0.3, false, true,  null);

var knifeHitBox = new Rectangle(new Vector(10, 20),new Vector(30, 30))
var knife = new Weapon("knife", knifeHitBox, 80, 300, new Vector(10,0), 0.5, true, false, [0]);

var starHitBox = new Rectangle(new Vector(10, 30),new Vector(20, 40))
var star = new Weapon("star", starHitBox, 50, 100, new Vector(12,0), 0.2, true, false, [1,2]);

var forkHitBox = new Rectangle(new Vector(10, 20),new Vector(30, 30))
var fork = new Weapon("fork", forkHitBox, 10, 1000, new Vector(20,-10), 0.5, true, false, [3]);

var fireballHitBox = new Rectangle(new Vector(10, 25),new Vector(30, 40))
var fireball = new Weapon("fireball", fireballHitBox, 20, 500, new Vector(8,0), 0.1, true, false, [4]);

var boomerangHitBox = new Rectangle(new Vector(10, 20),new Vector(25, 35))
var boomerang = new Weapon("boomerang", boomerangHitBox, 70, 100, new Vector(10,0), 0.2, true, false, [5,6,7,8]);

var mineHitBox = new Rectangle(new Vector(10, 30),new Vector(25, 40))
var mine = new Weapon("mine", mineHitBox, 40, 500, new Vector(0,10), 0.5, true, true, [15]);

var bowlHitBox = new Rectangle(new Vector(10, 30),new Vector(25, 50))
var bowl = new Weapon("bowl", bowlHitBox, 50, 500, new Vector(6,0), 0.1, true, true, [9]);


var itemSpritesIndex = {
    "knife":0,
    "star":2,
    "health":7,
    "fork": 4,
    "fireball":5,
    "boomerang":6,
    "mine":1,
    "bowl":1
}

var items = [
    ["knife", 5],
    ["knife", 10],
    ["star", 10],
    ["star", 20],
    ["health", 20],
    ["health", 30],
    ["health", 50],
    ["fork", 5],
    ["fork", 10],
    ["fireball", 15],
    ["fireball", 30],
    ["boomerang", 10],
    ["boomerang", 20],
    ["mine", 5],
    ["mine", 10]
    //["bowl", 10],
    //["bowl", 20]
]

//    -------------------------------------  ATTACKS   ------------------------------------------- //

function Attack(weapon, character){
    
    this.name = weapon.name;
    this.type = "attack"
    this.pos = character.pos;
    this.hitBox = weapon.hitBox;
    this.damage = weapon.damage;
    this.knockback = weapon.knockback;
    this.applyGravity = weapon.applyGravity

    this.attackTime = weapon.attackTime;
    this.progress = 0;
    this.finished = false;
    this.airLock = weapon.airLock;

    this.character = character;
    this.projectile = weapon.projectile;

    if (this.projectile){
        this.facing = character.facing;
        if (this.facing == "right") {
            this.speed = new Vector(weapon.speed.x, weapon.speed.y)
        }    else {
            this.speed = new Vector(weapon.speed.x * -1, weapon.speed.y)
        }
    }

    this.sprites = weapon.sprites;

    if (renderHitboxes){

        $("#hitboxes").append("<div class = 'attack hitbox'></div>")
        this.$hitBox = $("#hitboxes div:last-child")
        this.$hitBox.css("width",this.hitBox.BR.x - this.hitBox.TL.x + "px")
        this.$hitBox.css("height",this.hitBox.BR.y - this.hitBox.TL.y   + "px")

    }

    if (this.sprites){

        $("#attacks").append("<div class = '" + character.name + "s " + weapon.name + "'><img></div>")
        this.$DOM = $("#attacks div:last-child")

        this.spritesheet = new Spritesheet("/snippets/spritewars/resources/images/Weapons.png", 32, 32, "#attacks div:last-child", 50, 50)

        this.spritesheet.$img.css("clip", "rect(0px, 0px, 0px, 0px)")

        this.frameSize = 50
        this.frame = 0;
        this.spritesheetBuffer = new Vector(0,0)

    }

}

Attack.prototype.updatePosition = function(step, level){

    if (this.projectile){

        if (this.name == "boomerang") {
            if (this.facing == "right") {
                this.speed.x -= 0.25
            } else {
                this.speed.x += 0.25
            }
        }

        var newposX = this.pos.plus(new Vector(this.speed.x , 0))

        var obstacle = level.obstacleAt(this.pos, this.hitBox)

        if (obstacle) {

            this.finished = true;

        } else{

            this.pos = newposX;

        }

        if (this.applyGravity) this.speed.y += level.gravityForce

        var newPosY = this.pos.plus(new Vector(0, this.speed.y * step ))

        obstacle = level.obstacleAt(newPosY, this.hitBox)

        if (!obstacle) {

            this.pos = newPosY;

        } else {

            this.speed.y = 0;
        }

    } else {

            if (this.character.facing == "left"){    
                this.pos = this.character.pos
            } else {
                this.pos = new Vector(this.character.pos.x + this.character.hitBox.BR.x, this.character.pos.y) 
            }
    }
}

Attack.prototype.checkForHits = function(step,level){

    var exclude = this.character
    if (this.name == "boomerang" && this.progress > 1) exclude = {} 

    var otherActor = level.actorAt(this, exclude)

    if (otherActor && otherActor.type == "character") {
        otherActor.gotHit = true;
        otherActor.airborne = true;
        
        var otherDirection = this.pos.plus(this.hitBox.BR.times(0.5)).plus(otherActor.pos.plus(otherActor.size.times(0.5)).times(-1))
        var pushDirection = otherDirection.x / Math.abs(otherDirection.x)
        otherActor.knockbackForce = pushDirection * -this.knockback
        otherActor.speed.y -= otherActor.jumpHeight/3;
        otherActor.HP -= this.damage / otherActor.defence
        if (otherActor.HP <= 0){
            otherActor.dead = true;
            otherActor.HP = 0;
        }
        this.finished = true;
        this.damage = 0;
    } else if (otherActor && otherActor.type == "crate"){
        otherActor.breakMe(level)
        this.finished = true;
    } else if (otherActor && otherActor.name == "mine" && otherActor.character != this.character){
        this.finished = true;
        otherActor.finished = true;
    }
}

Attack.prototype.checkProgress = function(step, level){
    this.progress += step;

    if (this.progress >= this.attackTime && !this.projectile || this.projectile && this.finished) {
        this.removeMe(level)
    }
}

Attack.prototype.removeMe = function(level){

    this.character.attacks.forEach(function(attack, index){
        if (attack == this) {
            var removedAttack = this.character.attacks.splice(index, 1)
            if (renderHitboxes) removedAttack[0].$hitBox.remove()
            if (this.sprites) removedAttack[0].$DOM.remove()
        }
    }, this)

    level.actors.forEach(function(actor, index){
        if (actor == this) level.actors.splice(index, 1)
    }, this)
}

Attack.prototype.draw = function(level){

	level.renderHitboxOf(this)

    if (this.sprites){

        var currentFrame = Math.floor(this.frame/10) % this.sprites.length
        var left = this.sprites[currentFrame] * this.frameSize;
        var right = left + this.frameSize

        if (this.facing == "right"){
            this.spritesheetBuffer.x = - left
            this.spritesheet.$img.css("transform", "scaleX(1)")
        } else if ((this.facing == "left")){
            this.spritesheetBuffer.x = right - this.spritesheet.image.width - this.hitBox.BR.x
            this.spritesheet.$img.css("transform", "scaleX(-1)")
        }

        this.spritesheet.$img.css("left",this.pos.x * xfudge + this.hitBox.TL.x + this.spritesheetBuffer.x + "px")
        this.spritesheet.$img.css("top",this.pos.y + this.hitBox.TL.y  + this.spritesheetBuffer.y + "px")
        this.spritesheet.$img.css("clip", "rect(0px, " + right + "px, " + this.frameSize + "px, " + left + "px)")
        this.frame++
    }

}

Attack.prototype.act = function(step, level){

    this.updatePosition(step, level)
    this.checkForHits(step,level)
    this.checkProgress(step,level)
}

//    -------------------------------------  RUNNING THE GAME   ------------------------------------------- //

function runAnimation(frameFunc){

     var lastTime = null;

     function frame(time){
         var stop = false;
         if (lastTime != null){
             var timeStep = Math.min(time - lastTime, 100) / 1000;
             stop = frameFunc(timeStep) === false;
         }
         lastTime = time;
         if (!stop){
             requestAnimationFrame(frame)
         }
     }
     requestAnimationFrame(frame)

}

function varyCharacters(char){
    switch(char.name){
        case "nathan":
            char.moveSpeed *= 1.05;
            char.jumpHeight *= 0.95;
        break;
        case "yuriko":
            char.moveSpeed *= 0.95;
            char.jumpHeight *= 1.05;
        break;
        case "rina":
            char.moveSpeed *= 1.1;
            char.jumpHeight *= 1.1;
        break;
    }
}


function runGame(map, P1, P2) {

	var level = new Level($("body"), map)
	level.P1 = new Character(P1, "/snippets/spritewars/resources/images/" + P1 + ".png", P1keys , new Vector(150, 15), new Vector(40, 40), level)
	level.P2 = new Character(P2, "/snippets/spritewars/resources/images/" + P2 + ".png", P2keys , new Vector(600, 15), new Vector(40, 40), level)
	level.P1.facing = "right"
	
    varyCharacters(level.P1);
    varyCharacters(level.P2);


    level.init(map)
		
	runAnimation(function(step) {
		level.animate(step);

	});

}

// -------------------------------- MANAGE KEYS ----------------------------- //

var P1keys = {
    left: [65, false],
    right: [68, false],
    jump: [87, false],
    attack: [32, false],
    weaponLeft: [81, false],
    weaponRight: [69, false]
}

var P2keys = {
    left: [37, false],
    right: [39, false],
    jump: [38, false],
    attack: [13, false],
    weaponLeft: [16, false],
    weaponRight: [17, false]
}

var keyRing = [P1keys, P2keys]

$(document).keydown(function(key){
    key.preventDefault();
    keyRing.forEach(function(keys){
        for (var k in keys){
            if (keys[k][0] == key.keyCode) keys[k][1] = true;
        }
    });
})
$(document).keyup(function(key){
    keyRing.forEach(function(keys){
        for (var k in keys){
            if (keys[k][0] == key.keyCode) keys[k][1] = false;
        }
    });
})

