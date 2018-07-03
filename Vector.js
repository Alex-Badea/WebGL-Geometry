class Vector extends Arrow {
	constructor(name, p) {
		if (p == undefined)
			throw new Error("Undefined or null params");
		origin = new Point("O", vec3.fromValues(0, 0, 0), p.color);
		super(name, origin, p);
	}
}