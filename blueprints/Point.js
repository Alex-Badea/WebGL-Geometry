class Point extends DrawableBlueprint {
	constructor(name, color, position) {
		super(name, color);
		if (position == undefined)
			throw new Error("Undefined or null params");
		this.position = position;
	}
	
	instantiate(gl, programInfo) {
		if (gl == undefined || programInfo == undefined)
			throw new Error("Undefined or null params");
		return new PointInstance(this, gl, programInfo);
	}
}