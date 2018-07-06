class TriangleInstance extends DrawableInstance {
	constructor(drawable, gl, programInfo) {
		super(drawable, gl, programInfo);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.position);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([...drawable.p1.position, ...drawable.p2.position, ...drawable.p3.position]), gl.STATIC_DRAW);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.color);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([...drawable.color, 0.5, ...drawable.color, 0.5, ...drawable.color, 0.5]), gl.STATIC_DRAW);
	}

	draw() {
		super.draw();
		
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.position);
		this.gl.vertexAttribPointer(this.programInfo.attribLocations.vertexPosition, 3, this.gl.FLOAT, false, 0, 0);
		this.gl.enableVertexAttribArray(this.programInfo.attribLocations.vertexPosition);
		
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.color);
		this.gl.vertexAttribPointer(this.programInfo.attribLocations.vertexColor, 4, this.gl.FLOAT, false, 0, 0);
		this.gl.enableVertexAttribArray(this.programInfo.attribLocations.vertexColor);
		
		// Testul de ad�ncime dezactivat pentru transparen?�
		this.gl.disable(this.gl.DEPTH_TEST);
		this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);	
		this.gl.enable(this.gl.DEPTH_TEST);
	}

	getNamePos() {
		return vec3.fromValues((this.drawable.p1.position[0] + this.drawable.p2.position[0] + this.drawable.p3.position[0])/3,
							   (this.drawable.p1.position[1] + this.drawable.p2.position[1] + this.drawable.p3.position[1])/3,
							   (this.drawable.p1.position[2] + this.drawable.p2.position[2] + this.drawable.p3.position[2])/3);
	}
}