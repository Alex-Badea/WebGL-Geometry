class ArrowInstance extends SegmentInstance {
	constructor(drawable, gl, programInfo) {
		super(drawable, gl, programInfo);
		this.initArrowHead();
	}
	
	draw() {
		super.draw();
		this.drawArrowHead();
	}
	
	initArrowHead() {
		const dir = vec3.normalize(vec3.create(), vec3.sub(vec3.create(), this.drawable.p1.position, this.drawable.p2.position));
		const basePos = vec3.add(vec3.create(), this.drawable.p2.position, vec3.scale(vec3.create(), dir, 0.1));
		
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
		
		const p1 = new Point("", this.drawable.p2.color, shiftedBasePos1);
		const p2 = new Point("", this.drawable.p2.color, shiftedBasePos2);
		const p3 = new Point("", this.drawable.p2.color, shiftedBasePos3);
		const p4 = new Point("", this.drawable.p2.color, shiftedBasePos4);
		const p5 = new Point("", this.drawable.p2.color, shiftedBasePos5);
		const p6 = new Point("", this.drawable.p2.color, shiftedBasePos6);
		
		this.s1 = new Segment("", this.drawable.color, this.drawable.p2, p1).instantiate(this.gl, this.programInfo);
		this.s2 = new Segment("", this.drawable.color, this.drawable.p2, p2).instantiate(this.gl, this.programInfo);
		this.s3 = new Segment("", this.drawable.color, this.drawable.p2, p3).instantiate(this.gl, this.programInfo);
		this.s4 = new Segment("", this.drawable.color, this.drawable.p2, p4).instantiate(this.gl, this.programInfo);
		this.s5 = new Segment("", this.drawable.color, this.drawable.p2, p5).instantiate(this.gl, this.programInfo);
		this.s6 = new Segment("", this.drawable.color, this.drawable.p2, p6).instantiate(this.gl, this.programInfo);
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