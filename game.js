//our variables
var Neuvol;
var game;
var FPS = 60;

var button = document.getElementById("a");
//create canvas
function setup(){
    createCanvas(1024,768);
}

var Game = function(){
    //ships array that we fill with ships later
	this.ships = [];

    //AI variables
	this.gen = [];
	this.alives = 0;
	this.generation = 0;
	this.maxScore = 0;
    this.setup = function(){
        createCanvas(1024,768);
    }
    this.update = function(){
        //make background black
        background(0);
        //check for ships
        for(var i in this.ships){
            //if ship is alive
            if(this.ships[i].gameOver != true){
                //get the sensors for ai input and calculate it
                var inputs = this.ships[i].sensor(this.ships[i].asteroids);
                var res = this.gen[i].compute(inputs);
                //decide what to do
                if(res[0] > 0.65){
                    this.ships[i].thrusht();
                }
                if(res[1] > 0.65){
                    this.ships[i].setRotRate(0.1);
                }
                if(res[1] < 0.45){
                    this.ships[i].setRotRate(-0.1);
                }
                if(res[2] > 0.6){
                    this.ships[i].pewpew();
                }
                //update the ship. asteroids and all kinda stuff will be updated in this function
                this.ships[i].update();
		if(this.maxScore < this.ships[i].score)
			this.maxScore = this.ships[i].score;
                //if ship is dead
                if(this.ships[i].gameOver == true){
                    this.alives--;
                    //saving its score for ai next gens
                    Neuvol.networkScore(this.gen[i], this.ships[i].score);
                    if(this.isItEnd()){
                        this.start();
                    }
                }
    
            }
        }
        var self = this;
    
        //framerate things
        if (FPS == 0) {
            setZeroTimeout(function() {
                self.update();
            });
        }
        else {
            setTimeout(function(){
                self.update();
            }, 1000/FPS);
        }
    
        this.display();
    }

    // display ships and generation
    this.display = function(){
        for(var i = 0; i<this.ships.length;i++){
            this.ships[i].update;
        }
        push();
        textSize(32);
        fill(255, 255, 255);
	text('Max Score: '+this.maxScore.toFixed(1), 10, 30);
        text('Gen: '+this.generation, width - 150, 30);
        pop();
    }
    //check if any ship alive
    this.isItEnd = function(){
        for(var i in this.ships){
            if(this.ships[i].gameOver == false){
                return false;
            }
        }
        return true;
    }

}

Game.prototype.start = function(){
    this.ships = [];
    this.maxScore = 0;
    this.gen = Neuvol.nextGeneration();
    for(var i in this.gen){
        var a = new Ship();
        this.ships.push(a);
        for(var j = 0; j < this.ships[i].asteroidCount; j++)
            this.ships[i].asteroids.push(new Asteroid(null, null, this.ships[i].r, this.ships[i].g, this.ships[i].b));
    }
this.generation++;
this.alives = this.ships.length;
}
/*function setup(){
    createCanvas(1024,768);
    ship = new Ship();
    for(var i = 0; i < ship.asteroidCount; i++)
        ship.asteroids.push(new Asteroid());
}

function restart(){
    ship = new Ship();
    for(var i = 0; i < ship.asteroidCount; i++)
        ship.asteroids.push(new Asteroid());
}

function draw(){
    ship.update();
}*/

//starting function of ai
function start(){
    //create new ai variable i use 10 population for each gen 9 input and 3 output
    Neuvol = new Neuroevolution({
        population:10,
        network:[9, [100], 3],
        randomBehaviour:0.1,
        mutationRate:0.2, 
        mutationRange:1, 
    });
    game = new Game();
    game.start();
    if (FPS == 0) {
        setZeroTimeout(function() {
            game.update();
        });
    }
    else {
        setTimeout(function(){
            game.update();
        }, 1000/FPS);
    }
}


/*function keyReleased(){
    if(keyCode == RIGHT_ARROW || keyCode == LEFT_ARROW || key == 'd' || key == 'a')
        ship.setRotRate(0);
    else if(keyCode == UP_ARROW || key == 'w')
        ship.thrushting(false);
}

function keyPressed(){
    if(key == 'r' && ship.gameOver)
        restart();
    if(key == ' ')
        ship.pewpew();
    if(keyCode == RIGHT_ARROW || key == 'd')
        ship.setRotRate(0.1);
    else if (keyCode == LEFT_ARROW || key == 'a')
        ship.setRotRate(-0.1);
    else if (keyCode == UP_ARROW || key == 'w')
        ship.thrushting(true);
}*/
button.addEventListener ("click", function() {
    start();
  });
