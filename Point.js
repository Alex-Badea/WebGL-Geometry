class Point extends Drawable {
	constructor(name, position, color) {
		super(name);
		if (position == undefined || color == undefined)
			throw new Error("Undefined or null params");
		this.position = position;
		this.color = color;
	}
	
	init(gl) {
		super.init(gl);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.position);
		gl.bufferData(gl.ARRAY_BUFFER, this.position, gl.STATIC_DRAW);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.color);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([...this.color, 1]), gl.STATIC_DRAW);
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
		
		this.gl.drawArrays(this.gl.POINTS, 0, 1);	
	}
	
	_DRAW_NAME() {
		super._DRAW_NAME();
	}
	
	getNamePos() {
		return this.position;
	}
}