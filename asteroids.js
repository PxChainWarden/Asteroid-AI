function Asteroid(p,s, r, g, b){
    //random velocity for asteroids
    this.velocity = createVector(random(-5,5),random(-5,5));
	//rgb values for asteroids color
	if(r)
		this.r = r;
	else
		this.r = 255;
	
	if(g)
		this.g = g;
	else
		this.g = 255;
	
	if(b)
		this.b = b;
	else
        this.b = 255;
        
    //set scale and position
    if(s)
        this.scale = s;
    else
        this.scale = 50;
    if(p)
        this.pos = p.copy();
    else
        this.pos = createVector(random(width,width+this.scale),random(height,height+this.scale));

    this.render = function(){
        push();
        //render a circle empty inside
        translate(this.pos.x,this.pos.y);
        noFill();
        stroke(this.r, this.g, this.b, 255);
        ellipse(0,0,this.scale*2);
        pop();
    }

    // if we hit the asteroid it will breakup if its big enough
    this.breakUp = function(){
        //check if its big
        if(this.scale > 20){
            //create new asteroids in that position
            nAsteroid = [];
            nAsteroid[0] = new Asteroid(this.pos, this.scale-15, this.r, this.g, this.b);
            nAsteroid[1] = new Asteroid(this.pos, this.scale-15, this.r, this.g, this.b);
            return nAsteroid;
        }
        //if not then dont create new
        return false;
    }

    // raycasting
	this.rayHit = function(shipPos, rayLast){
		var t = Math.abs(((rayLast.x - shipPos.x)*(shipPos.y - this.pos.y)) - ((shipPos.x - this.pos.x)*(rayLast.y - shipPos.y)));
		var b = Math.sqrt(Math.pow(rayLast.x - shipPos.x, 2) + Math.pow(rayLast.y - shipPos.y, 2));
		
		var d = t/b;
		var dot = p5.Vector.dot(createVector(rayLast.x, rayLast.y).sub(shipPos), createVector(this.pos.x, this.pos.y).sub(shipPos));
		
		if(dot > 0 && d <= this.scale)
			return createVector(shipPos.x, shipPos.y).sub(this.pos).normalize().mult(this.scale).add(this.pos);
		else
			return rayLast;
	}

    //check for if asteroid leaves screen if it is then reappear it on other side
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

    // update render and logic stuff
    this.update = function(){
        this.render();
        this.pos.add(this.velocity);
        this.checkEdges();
    }
}