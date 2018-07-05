class Arrow extends Segment {
	constructor(name, color, p1, p2) {
		super(name, color, p1, p2);
	}
	
	instantiate(gl, programInfo) {
		if (gl == undefined || programInfo == undefined)
			throw new Error("Undefined or null params");
		return new ArrowInstance(this, gl, programInfo);
	}
}