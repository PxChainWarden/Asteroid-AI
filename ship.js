function Ship() {
    //set pos to center
    this.pos = createVector(width/2,height/2);
    this.scale = 20;
    this.rotation = 0;
    this.rotRate = 0;
    this.velocity = createVector(0,0);
    this.isTrhusting = false;
    //i want to calculate all the logic in the ship so i added bullets and asteroids to ship
    this.bullets = [];
    //our sensors 
    this.sensors = [];
    this.nbSensors = 9;
    this.maxSensorSize = 750;
    this.asteroids = [];
    this.asteroidCount = 3;
    this.gameOver = false;
    this.score = 0;
	this.gunCoolDown = 1;
	this.r = random(0, 255);
	this.g = random(0, 255);
    this.b = random(0, 255);
    //up vector
    this.upDir = createVector(0, -height);
	
    //up,left, right
    //our vectors we raycast later
	this.rays = [createVector(0, -this.maxSensorSize),
        createVector(this.maxSensorSize, -this.maxSensorSize),
        createVector(this.maxSensorSize, 0),
        createVector(this.maxSensorSize, this.maxSensorSize),
        createVector(0, this.maxSensorSize),
        createVector(-this.maxSensorSize, this.maxSensorSize),
        createVector(-this.maxSensorSize, 0),
        createVector(-this.maxSensorSize, -this.maxSensorSize)];
	this.rayHits = [createVector(0, -this.maxSensorSize),
        createVector(this.maxSensorSize, -this.maxSensorSize),
        createVector(this.maxSensorSize, 0),
        createVector(this.maxSensorSize, this.maxSensorSize),
        createVector(0, this.maxSensorSize),
        createVector(-this.maxSensorSize, this.maxSensorSize),
        createVector(-this.maxSensorSize, 0),
        createVector(-this.maxSensorSize, -this.maxSensorSize)];

    this.render = function(){
        push();
        //render a triangle yaaay a space ship
        translate(this.pos.x,this.pos.y);
        noFill();
        rotate(this.rotation);
        stroke(this.r, this.g, this.b, 255);
        triangle(-this.scale,this.scale-8.5, this.scale,this.scale-8.5, 0,-this.scale-8.5);
		/*for(var i in this.rayHits) // *debug* enable visible raycasting
		{
			var modified = createVector(this.rayHits[i].x - this.pos.x, this.rayHits[i].y - this.pos.y);
			line(0, 0, modified.x, modified.y);
		}*/
		/*stroke(0,255,0,255);
		for(var i in this.rayHits)
		{
			var modified = createVector(this.rays[i].x, this.rays[i].y);
			line(0, 0, modified.x, modified.y);
		}*/
        pop();
    }

    this.setRotRate = function(angle){
        //setting rotation rate
        this.rotRate = angle;
    }

    this.turn = function(){
        //turn the ship rotation rate amount
        this.rotation += this.rotRate;
    }

    this.thrusht = function(){
        //get vector from ships angle and add it to velocity vector
        var force = p5.Vector.fromAngle(this.rotation - PI / 2);
        force.mult(0.2);
        this.velocity.add(force);
    }

    this.thrushting = function(b){
        // a boolean for if ship thrushts
        this.isTrhusting = b;
    }

    this.pewpew = function(){
        //shoot if there is no cooldown
		if(this.gunCoolDown <= 0)
		{
            //create new bullet
			this.bullets.push(new Bullet(this.pos,this.rotation, this.velocity.mag(), this.r, this.g, this.b));
			this.gunCoolDown = 1;
		}
    }

    //check if ship leaves the screen, if it is reappear it on the other side
    this.checkEdges = function(){
        if(this.pos.x > width + this.scale)
            this.pos.x = -this.scale;
        else if(this.pos.x < -this.scale)
            this.pos.x = width + this.scale;
        if(this.pos.y > height + this.scale)
            this.pos.y = -this.scale;
        else if(this.pos.y < -this.scale)
            this.pos.y = height + this.scale;
    }

    //check if ship hits the asteroid, I cheesed a bit ship has circle collider for performances sake i dont have a great pc
    this.hit = function(asteroid){
        if((this.pos.x - asteroid.pos.x)**2 + (this.pos.y - asteroid.pos.y)**2 <= asteroid.scale**2 + (this.scale-2)**2 + 2*asteroid.scale*(this.scale-2))
            return true;
        return false;
    }

    this.sensor = function(asteroids){
    	for(var i = 0; i < this.nbSensors; i++){
    		this.sensors.push(1);
    	}
		
		for(var j in this.rays)
		{
            //raycasting time
			var hits = [];
			var rayLast = createVector(this.pos.x, this.pos.y).add(this.rays[j]);
			
			for(var i in asteroids)
			{
                //check every asteroid if the ray hits
				hits.push(asteroids[i].rayHit(this.pos, rayLast));
			}
			
			var selected = hits[0];
			var sqrDist = hits[0].magSq();
			for(var k = 1; k < hits.length; k++)
			{
				var sqr = hits[k].magSq();
				if(sqr < sqrDist)
				{
					sqrDist = sqr;
					selected = hits[k];
				}
			}
			
			var hitFromShip = createVector(selected.x, selected.y).sub(this.pos);
			
			if(hitFromShip.magSq() < this.rays[j].magSq())
			{
				this.rayHits[j] = selected; //Hit
				this.sensors[j] = hitFromShip.magSq();
			}
			else
			{
				this.rayHits[j] = rayLast; //Not hit
				this.sensors[j] = this.maxSensorSize;
			}
        }
        var rot = this.upDir.angleBetween(createVector(this.upDir.x, this.upDir.y).rotate(this.rotation - PI/2));
		this.sensors[8] = degrees(rot);

        /*var v= p5.Vector.fromAngle(this.rotation - PI / 2);
        var v2 = createVector(0,-height);
		this.sensors[8] = degrees(v2.angleBetween(v));
*/
    	return this.sensors;
    }

    this.collisionDetect = function(bullets,asteroid){
        //if bullet hits the asteroid, add new asteroids to asteroids list if there is any new asteroids created
        for(var i = bullets.length -1; i >= 0; i--)
            for(var j = asteroid.length -1; j >= 0 ; j--)
                if(bullets[i].hits(asteroid[j])){
                    var newPieces = asteroid[j].breakUp();
                    if(newPieces){
                        asteroid.push(newPieces[0]);
                        asteroid.push(newPieces[1]);
                    }
                    this.score += 1;
                    //delete the bullet and old asteroid
                    asteroid.splice(j,1);
                    bullets.splice(i,1);
                    break;
                }
    }

    this.collisionShip = function(asteroid)
    {
        //if ship hits the asteroid make gameover flag ture
        for(var i = 0; i<this.asteroids.length; i++)
            if(this.hit(this.asteroids[i]))
                this.gameOver = true;
    }

    //do the game logic and stuff in one function just a general update
    this.update = function(){
        if(!this.gameOver)
        {
            //background(0);
            for(var i = 0; i<this.asteroids.length; i++)
                this.asteroids[i].update();
            for(var i = 0; i<this.bullets.length; i++)
                this.bullets[i].update();
            this.collisionDetect(this.bullets, this.asteroids);
            this.collisionShip(this.asteroids);
            if(this.isTrhusting)
                this.thrusht();
            this.turn();
            this.render();
            this.pos.add(this.velocity);
            this.velocity.mult(0.99);
            this.checkEdges();
            //if bullet gone too far delete it
            for(var i = this.bullets.length -1; i >= 0; i--)
                if(this.bullets[i].dist >= 750)
                    this.bullets.splice(i,1);
            //if there is no asteroids make more of 'em
            if(this.asteroids.length == 0){
                this.asteroidCount++;
                for(var i = 0; i < this.asteroidCount; i++)
                    this.asteroids.push(new Asteroid(null, null, this.r, this.g, this.b));
            }
            //this.score += 0.1;
			this.gunCoolDown -= 0.1;
        }
    }
}
