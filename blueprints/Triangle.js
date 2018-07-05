class Triangle extends DrawableBlueprint {
	constructor(name, color, p1, p2, p3) {
		super(name, color);
		if (p1 == undefined || p2 == undefined || p3 == undefined)
			throw new Error("Undefined or null params");
		this.p1 = p1;
		this.p2 = p2;
		this.p3 = p3;
	}
	
	instantiate(gl, programInfo) {
		if (gl == undefined || programInfo == undefined)
			throw new Error("Undefined or null params");
		return new TriangleInstance(this, gl, programInfo);
	}
}