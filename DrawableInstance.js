class DrawableInstance {
	constructor(drawable, gl, programInfo) {
		if (new.target === DrawableInstance)
			throw new TypeError("Cannot instantiate abstract class");
		if (drawable == undefined || gl == undefined || programInfo == undefined)
			throw new Error("Undefined or null params");
		this.drawable = drawable;
		this.gl = gl;
		this.programInfo = programInfo;
		this.buffers = {
			position: gl.createBuffer(),
			color: gl.createBuffer()
 		};
		
		this._INIT_NAME(drawable, gl);
	}
	
	draw() {
		if (this.gl.getUniform(this.programInfo.program, this.programInfo.uniformLocations.modelMatrix, 0).every((e, i) => mat4.fromValues(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0)[i] === e))
			throw new Error("Stray drawable not bound to any drawing context (coordinate system): " + this.name);
		
		this._DRAW_NAME(this.programInfo);
	}
	
	getNamePos() {
		throw new Error("Cannot call abstract method");
	}
	
	// Depreciat: va fi înocuitã când se va gãsi o metodã mai bunã
	_INIT_NAME(drawable, gl) {
		if (drawable == undefined || gl == undefined)
			throw new Error("Undefined or null params");
		
		// NU MAI CREA DACÃ NUMELE E GOL@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
		this.nameContainer = document.createElement("div");
		this.nameContainer.innerHTML = drawable.name;
		this.nameContainer.setAttribute("style", "position: absolute;-webkit-touch-callout: none;-webkit-user-select: none;-khtml-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;");
		document.body.appendChild(this.nameContainer);
	}
	
	// Depreciat: va fi înocuitã când se va gãsi o metodã mai bunã
	// DE TESTAT DACÃ SE DESENEAZÃ RELATIV LA PÂNZÃ SAU RELATIV LA FEREASTRÃ; REPARÃ DACÃ RELATIV LA FEREASTRÃ
	_DRAW_NAME(programInfo) {
		if (programInfo == undefined)
			throw new Error("Undefined or null params");
		
		const projectionMatrix = this.gl.getUniform(programInfo.program, programInfo.uniformLocations.projectionMatrix, 0);
		const viewMatrix = this.gl.getUniform(programInfo.program, programInfo.uniformLocations.viewMatrix, 0);
		const modelMatrix = this.gl.getUniform(programInfo.program, programInfo.uniformLocations.modelMatrix, 0);
				
		const namePos = vec4.fromValues(...this.getNamePos(), 1);
		const mvp = mat4.multiply(mat4.create(), mat4.multiply(mat4.create(), projectionMatrix, viewMatrix), modelMatrix);
		const nameMvpPos = vec4.transformMat4(vec4.create(), namePos, mvp);
		const nameNormScrPos = [nameMvpPos[0]/nameMvpPos[3], nameMvpPos[1]/nameMvpPos[3]];
		const nameScrPos = [(nameNormScrPos[0]*0.5+0.5)*this.gl.canvas.width,
							(nameNormScrPos[1]*-0.5+0.5)*this.gl.canvas.height];
		if (nameScrPos[0] > 0 && nameScrPos[0] < this.gl.canvas.width && nameScrPos[1] > 0 && nameScrPos[1] < this.gl.canvas.height && nameMvpPos[2] > 0) {
			this.nameContainer.style.left = nameScrPos[0];
			this.nameContainer.style.top = nameScrPos[1];
			this.nameContainer.style.display = "inline";
		} else
			this.nameContainer.style.display = "none";
	}
}