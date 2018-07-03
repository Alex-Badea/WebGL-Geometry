class Arrow extends Segment {
	constructor(name, p1, p2) {
		super(name, p1, p2);
	}
	
	init(gl) {
		super.init(gl);
		this.initArrowHead(gl);
	}
	
	draw(programInfo) {
		super.draw(programInfo);
		this.drawArrowHead(programInfo);
	}
	
	initArrowHead(gl) {
		const dir = vec3.normalize(vec3.create(), vec3.sub(vec3.create(), this.p1.position, this.p2.position));
		const basePos = vec3.add(vec3.create(), this.p2.position, vec3.scale(vec3.create(), dir, 0.1));
		
		const xAxis = vec3.fromValues(1, 0, 0);
		const yAxis = vec3.fromValues(0, 1, 0);
		const zAxis = vec3.fromValues(0, 0, 1);
		
		const newDir1 = vec3.scale(vec3.create(), vec3.normalize(vec3.create(), vec3.cross(vec3.create(), dir, xAxis)), 0.02);
		const newDir2 = vec3.negate(vec3.create(), newDir1);
		const newDir3 = vec3.scale(vec3.create(), vec3.normalize(vec3.create(), vec3.cross(vec3.create(), dir, yAxis)), 0.02);
		const newDir4 = vec3.negate(vec3.create(), newDir3);
		const newDir5 = vec3.scale(vec3.create(), vec3.normalize(vec3.create(), vec3.cross(vec3.create(), dir, zAxis)), 0.02);
		const newDir6 = vec3.negate(vec3.create(), newDir5);
		
		const shiftedBasePos1 = vec3.add(vec3.create(), basePos, newDir1);
		const shiftedBasePos2 = vec3.add(vec3.create(), basePos, newDir2);
		const shiftedBasePos3 = vec3.add(vec3.create(), basePos, newDir3);
		const shiftedBasePos4 = vec3.add(vec3.create(), basePos, newDir4);
		const shiftedBasePos5 = vec3.add(vec3.create(), basePos, newDir5);
		const shiftedBasePos6 = vec3.add(vec3.create(), basePos, newDir6); 
		
		const p1 = new Point("P1", shiftedBasePos1, this.p2.color);
		const p2 = new Point("P2", shiftedBasePos2, this.p2.color);
		const p3 = new Point("P3", shiftedBasePos3, this.p2.color);
		const p4 = new Point("P4", shiftedBasePos4, this.p2.color);
		const p5 = new Point("P5", shiftedBasePos5, this.p2.color);
		const p6 = new Point("P6", shiftedBasePos6, this.p2.color);
		
		this.s1 = new Segment("S1", this.p2, p1);
		this.s2 = new Segment("S2", this.p2, p2);
		this.s3 = new Segment("S3", this.p2, p3);
		this.s4 = new Segment("S4", this.p2, p4);
		this.s5 = new Segment("S5", this.p2, p5);
		this.s6 = new Segment("S6", this.p2, p6);
		
		this.s1.init(gl);
		this.s2.init(gl);
		this.s3.init(gl);
		this.s4.init(gl);
		this.s5.init(gl);
		this.s6.init(gl);
	}
	
	drawArrowHead(programInfo) {
		this.s1.draw(programInfo);
		this.s2.draw(programInfo);
		this.s3.draw(programInfo);
		this.s4.draw(programInfo);
		this.s5.draw(programInfo);
		this.s6.draw(programInfo);
	}
}