function Bullet(shipPos,shipRotation,shipMagvel, r, g, b) {
    //set the posistion and velocity for bullet
    this.pos = createVector(shipPos.x,shipPos.y);
    //we use ships heading vector and add it shipVelocitys magnitude plus 10(bullet velocity) for accurate velocity
    this.velocity = p5.Vector.fromAngle(shipRotation - PI / 2,shipMagvel+10);
    //bullet size
    this.scale = 4;
    this.magVel = shipMagvel +10;
    this.dist = 0;
	
	this.r = r;
	this.g = g;
	this.b = b;

    this.render = function(){
        push();
        //render a point for bullet with color;
        stroke(this.r, this.g, this.b, 255);
        strokeWeight(this.scale);
        point(this.pos.x+ this.velocity.x,this.pos.y+ this.velocity.y);
        pop();
    }

    //if bullet leaves screen reappear it on the other side
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

    // hit check for if bullet hits an asteroid
    this.hits = function(asteroid){
        //check if distance between asteroids center and bullet is greater than asteroids radius
        if((this.pos.x - asteroid.pos.x)**2 + (this.pos.y - asteroid.pos.y)**2 <= asteroid.scale**2)
        // if it is then we hit
            return true;
        // else we dont hit
        return false;
    }

    //update render and logic stuff
    this.update = function(){
        this.pos.add(this.velocity);
        this.render();
        this.checkEdges();
        this.dist+= this.magVel;
    }
}