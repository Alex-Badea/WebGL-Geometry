class Vector extends Arrow {
	constructor(name, color, p) {
		if (p == undefined)
			throw new Error("Undefined or null params");
		const origin = new Point("", p.color, vec3.fromValues(0, 0, 0));
		super(name, color, origin, p);
	}
	
	instantiate(gl, programInfo) {
		if (gl == undefined || programInfo == undefined)
			throw new Error("Undefined or null params");
		return new VectorInstance(this, gl, programInfo);
	}
}