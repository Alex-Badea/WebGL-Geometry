class CoordSystem extends DrawableBlueprint {
	constructor(name, color, modelMatrix) {
		super(name, color);
		if (modelMatrix == undefined)
			throw new Error("Undefined or null params");
		this.modelMatrix = modelMatrix;
		this.drawList = [];
	}
	
	instantiate(gl, programInfo) {
		if (gl == undefined || programInfo == undefined)
			throw new Error("Undefined or null params");
		return new CoordSystemInstance(this, gl, programInfo);
	}
	
	add(drawable) {
		this.drawList.push(drawable);
	}
}