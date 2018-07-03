class Drawable {
	constructor(name) {
		if (new.target === Drawable)
			throw new TypeError("Cannot instantiate abstract class");
		if (name == undefined)
			throw new Error("Undefined or null params");
		this.name = name;
	}
	
	init(gl) {
		if (gl == undefined)
			throw new Error("Undefined or null params");
		this.gl = gl;
		this.buffers = {
			position: gl.createBuffer(),
			color: gl.createBuffer()
 		};
	}
	
	// Deprecated
	_INIT_NAME() {
		if (this.gl == undefined)
			throw new Error("Must initialize drawable before drawing name");
	}
	
	draw(programInfo) {
		if (this.gl == undefined)
			throw new Error("Must initialize WebGL context before drawing");
		if (programInfo == undefined)
			throw new Error("Undefined or null params");
		if (this.gl.getUniform(programInfo.program, programInfo.uniformLocations.modelMatrix, 0).every((e, i) => mat4.fromValues(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0)[i] === e))
			throw new Error("Stray drawable not bound to any context (coordinate system): " + this.name);
		this.programInfo = programInfo;
	}
	
	// Deprecated
	_DRAW_NAME(projectionMatrix, viewMatrix) {
		if (this.gl == undefined)
			throw new Error("Must initialize WebGL context before drawing name");
		if (this.programInfo == undefined)
			throw new Error("Must draw drawable before drawing name");
	}
	
	getNamePos() {
		throw new Error("Cannot call abstract method");
	}
}