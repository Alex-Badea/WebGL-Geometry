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
		
		this._INIT_NAME();
	}
	
	// Depreciat: va fi înocuită când se va găsi o metodă mai bună
	_INIT_NAME() {
		if (this.gl == undefined)
			throw new Error("Must initialize drawable before drawing name");
		
		this.nameContainer = document.createElement("div");
		this.nameContainer.innerHTML = this.name;
		this.nameContainer.setAttribute("style", "position: absolute;-webkit-touch-callout: none;-webkit-user-select: none;-khtml-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;");
		document.body.appendChild(this.nameContainer);
	}
	
	draw(programInfo) {
		if (this.gl == undefined)
			throw new Error("Must initialize WebGL context before drawing");
		if (programInfo == undefined)
			throw new Error("Undefined or null params");
		if (this.gl.getUniform(programInfo.program, programInfo.uniformLocations.modelMatrix, 0).every((e, i) => mat4.fromValues(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0)[i] === e))
			throw new Error("Stray drawable not bound to any drawing context (coordinate system): " + this.name);
		this.programInfo = programInfo;
		
		this._DRAW_NAME();
	}
	
	// Depreciat: va fi înocuită când se va găsi o metodă mai bună
	_DRAW_NAME() {
		if (this.gl == undefined)
			throw new Error("Must initialize WebGL context before drawing name");
		if (this.programInfo == undefined)
			throw new Error("Must draw drawable before drawing name");
		
		const projectionMatrix = this.gl.getUniform(this.programInfo.program, this.programInfo.uniformLocations.projectionMatrix, 0);
		const viewMatrix = this.gl.getUniform(this.programInfo.program, this.programInfo.uniformLocations.viewMatrix, 0);
		const modelMatrix = this.gl.getUniform(this.programInfo.program, this.programInfo.uniformLocations.modelMatrix, 0);
		
		const namePos = vec4.fromValues(...this.getNamePos(), 1);
		const mvp = mat4.multiply(mat4.create(), mat4.multiply(mat4.create(), projectionMatrix, viewMatrix), modelMatrix);
		const nameMvpPos = vec4.transformMat4(vec4.create(), namePos, mvp);
		const nameNormScrPos = [nameMvpPos[0]/nameMvpPos[3], nameMvpPos[1]/nameMvpPos[3]];
		const nameScrPos = [(nameNormScrPos[0]*0.5+0.5)*this.gl.canvas.width,
							(nameNormScrPos[1]*-0.5+0.5)*this.gl.canvas.height];
		if (nameScrPos[0] > 0 && nameScrPos[0] < this.gl.canvas.width && nameScrPos[1] > 0 && nameScrPos[1] < this.gl.canvas.height && nameMvpPos[2] > 0
			&& this.nameContainer.innerHTML !== "") {
			this.nameContainer.style.left = nameScrPos[0];
			this.nameContainer.style.top = nameScrPos[1];
			this.nameContainer.style.display = "inline";
		} else
			this.nameContainer.style.display = "none";
	}
	
	getNamePos() {
		throw new Error("Cannot call abstract method");
	}
}