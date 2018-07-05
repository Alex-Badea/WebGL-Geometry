class CoordSystemInstance extends DrawableInstance {
	constructor(drawable, gl, programInfo) {
		super(drawable, gl, programInfo);
		
		const r = drawable.color[0];
		const g = drawable.color[1];
		const b = drawable.color[2];
		const den = Math.max(r, g, b) + 1;
		this.xAxis = new Vector("", vec3.fromValues((r+1)/den, g/den, b/den), new Point("", vec3.fromValues(0,0,0), vec3.fromValues(1, 0, 0))).instantiate(gl, programInfo);
		this.yAxis = new Vector("", vec3.fromValues(r/den, (g+1)/den, b/den), new Point("", vec3.fromValues(0,0,0), vec3.fromValues(0, 1, 0))).instantiate(gl, programInfo);
		this.zAxis = new Vector("", vec3.fromValues(r/den, g/den, (b+1)/den), new Point("", vec3.fromValues(0,0,0), vec3.fromValues(0, 0, 1))).instantiate(gl, programInfo);

		this.instancesDrawList = [];
		for (let i = 0; i < drawable.drawList.length; i++)
			this.instancesDrawList[i] = drawable.drawList[i].instantiate(gl, programInfo);
	}
	
	draw() {
		const currentModelMatrix = this.gl.getUniform(this.programInfo.program, this.programInfo.uniformLocations.modelMatrix, 0);
		const modelMatrix = mat4.mul(mat4.create(), currentModelMatrix, this.drawable.modelMatrix);
		this.gl.uniformMatrix4fv(this.programInfo.uniformLocations.modelMatrix, false, modelMatrix);
		super.draw();

		this.xAxis.draw(this.programInfo);
		this.yAxis.draw(this.programInfo);
		this.zAxis.draw(this.programInfo);
		
		for (const e of this.instancesDrawList) {
			e.draw();
			this.gl.uniformMatrix4fv(this.programInfo.uniformLocations.modelMatrix, false, modelMatrix);
		}
	}
	
	getNamePos() {
		return vec3.fromValues(0.1, 0.1, 0.1);
	}
}