class Segment extends Drawable {
	constructor(name, p1, p2) {
		super(name);
		if (p1 == undefined || p2 == undefined)
			throw new Error("Undefined or null params");
		this.p1 = p1;
		this.p2 = p2;
	}
	
	init(gl) {
		super.init(gl);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.position);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([...this.p1.position, ...this.p2.position]), gl.STATIC_DRAW);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.color);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([...this.p1.color, 1, ...this.p2.color, 1]), gl.STATIC_DRAW);
	}
	
	draw(programInfo) {
		super.draw(programInfo);
		
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.position);
		this.gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 3, this.gl.FLOAT, false, 0, 0);
		this.gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
		
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.color);
		this.gl.vertexAttribPointer(programInfo.attribLocations.vertexColor, 4, this.gl.FLOAT, false, 0, 0);
		this.gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
		
		this.gl.drawArrays(this.gl.LINES, 0, 2);	
	}
	
	getNamePos() {
		return vec3.fromValues((this.p1.position[0] + this.p2.position[0])/2,
							   (this.p1.position[1] + this.p2.position[1])/2,
							   (this.p1.position[2] + this.p2.position[2])/2);
	}
}