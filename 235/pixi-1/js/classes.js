class Circle extends PIXI.Graphics{
	constructor(radius=20, color=0xFF0000, x=0, y=0){
		super();
		this.radius = radius;
		this.x = x;
		this.y = y;
		this.beginFill(color);
		this.drawCircle(0,0,radius);
		this.endFill();
		
		// other variables
		this.dx = Math.random() * 10 - 5;
		this.dy = Math.random() * 10 - 5;
	}
	
	move(){
		this.x += this.dx;
		this.y += this.dy;
	}
	
	reflectX(){
		this.dx *= -1;
	}
	
	reflectY(){
		this.dy *= -1;
	}
}

