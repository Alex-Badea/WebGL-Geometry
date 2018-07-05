class DrawableBlueprint {
	constructor(name, color) {
		if (new.target === DrawableBlueprint)
			throw new TypeError("Cannot instantiate abstract class");
		if (name == undefined || color == undefined)
			throw new Error("Undefined or null params");
		this.name = name;
		this.color = color;
	}
	
	instantiate(gl, programInfo) {
		throw new Error("Cannot call abstract method");
	}
}