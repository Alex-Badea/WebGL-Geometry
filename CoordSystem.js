class CoordSystem extends Drawable {
	constructor(name, modelMatrix) {
		super(name);
		if (modelMatrix == undefined)
			throw new Error("Undefined or null params");
		this.modelMatrix = modelMatrix;
		this.drawList = [];
	}
	
	add(drawable) {
		this.drawList.push(drawable);
	}
	
	init(gl) {
		super.init(gl);
		this.xAxis = new Vector("", new Point("", vec3.fromValues(1, 0, 0), vec3.fromValues(1, 0, 0)));
		this.yAxis = new Vector("", new Point("", vec3.fromValues(0, 1, 0), vec3.fromValues(0, 1, 0)));
		this.zAxis = new Vector("", new Point("", vec3.fromValues(0, 0, 1), vec3.fromValues(0, 0, 1)));
		
		this.xAxis.init(gl);
		this.yAxis.init(gl);
		this.zAxis.init(gl);
		
		for (const e of this.drawList) {
			e.init(gl);
		}
	}
	
	draw(programInfo) {
		super.draw(programInfo);
		const currentModelMatrix = this.gl.getUniform(programInfo.program, programInfo.uniformLocations.modelMatrix, 0);
		const modelMatrix = mat4.mul(mat4.create(), currentModelMatrix, this.modelMatrix);
		this.gl.uniformMatrix4fv(this.programInfo.uniformLocations.modelMatrix, false, modelMatrix);
		
		this.xAxis.draw(programInfo);
		this.yAxis.draw(programInfo);
		this.zAxis.draw(programInfo);
		
		for (const e of this.drawList) {
			e.draw(programInfo);
		}
	}
	
	getNamePos() {
		return vec3.fromValues(0.333, 0.333, 0.333);
	}
}