class Triangle extends Drawable {
	constructor(name, p1, p2, p3) {
		super(name);
		if (p1 == undefined || p2 == undefined || p3 == undefined)
			throw new Error("Undefined or null params");
		this.p1 = p1;
		this.p2 = p2;
		this.p3 = p3;
	}
	
	init(gl) {
		super.init(gl);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.position);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([...this.p1.position, ...this.p2.position, ...this.p3.position]), gl.STATIC_DRAW);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.color);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([...this.p1.color, 0.5, ...this.p2.color, 0.5, ...this.p3.color, 0.5]), gl.STATIC_DRAW);
	}
	
	_INIT_NAME() {
		super._INIT_NAME();
	}
	
	draw(programInfo) {
		super.draw(programInfo);
		
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.position);
		this.gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 3, this.gl.FLOAT, false, 0, 0);
		this.gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
		
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.color);
		this.gl.vertexAttribPointer(programInfo.attribLocations.vertexColor, 4, this.gl.FLOAT, false, 0, 0);
		this.gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
		
		this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);	
	}
	
	_DRAW_NAME() {
		super._DRAW_NAME();
	}
	
	getNamePos() {
		return vec3.fromValues((this.p1.position[0] + this.p2.position[0] + this.p3.position[0])/3,
							   (this.p1.position[1] + this.p2.position[1] + this.p3.position[1])/3,
							   (this.p1.position[2] + this.p2.position[2] + this.p3.position[2])/3);
	}
}