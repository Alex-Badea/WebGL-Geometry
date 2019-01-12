class CoordSystemInstance extends DrawableInstance {
	constructor(drawable, gl, programInfo) {
		super(drawable, gl, programInfo);

		this.xAxis = new Vector("", drawable.color[0], new Point("", vec3.fromValues(0,0,0), vec3.fromValues(1, 0, 0))).instantiate(gl, programInfo);
		this.yAxis = new Vector("", drawable.color[1], new Point("", vec3.fromValues(0,0,0), vec3.fromValues(0, 1, 0))).instantiate(gl, programInfo);
		this.zAxis = new Vector("", drawable.color[2], new Point("", vec3.fromValues(0,0,0), vec3.fromValues(0, 0, 1))).instantiate(gl, programInfo);

		this.instancesDrawList = [];
		for (let i = 0; i < drawable.drawList.length; i++)
			this.instancesDrawList[i] = drawable.drawList[i].instantiate(gl, programInfo);
	}
	
	draw() {
		const currentModelMatrix = this.gl.getUniform(this.programInfo.program, this.programInfo.uniformLocations.modelMatrix, 0);
		const modelMatrix = mat4.mul(mat4.create(), currentModelMatrix, this.drawable.modelMatrix);
		this.gl.uniformMatrix4fv(this.programInfo.uniformLocations.modelMatrix, false, modelMatrix);
		super.draw();

		this.xAxis.draw();
		this.yAxis.draw();
		this.zAxis.draw();
		
		for (const e of this.instancesDrawList) {
			this.gl.uniformMatrix4fv(this.programInfo.uniformLocations.modelMatrix, false, modelMatrix);
			e.draw();
		}
	}
	
	getNamePos() {
		return vec3.fromValues(0.1, 0.1, 0.1);
	}

	erase() {
		super.erase();
		this.instancesDrawList.forEach(e => e.erase());
	}
}