window.onload = main;
const Color = Object.freeze({BLK:vec3.fromValues(0, 0, 0), BLU:vec3.fromValues(0, 0, 1), GRN:vec3.fromValues(0, 1, 0), CYN:vec3.fromValues(0, 1, 1), RED:vec3.fromValues(1, 0, 0), PNK:vec3.fromValues(1, 0, 1), YLW:vec3.fromValues(1, 1, 0), WHT:vec3.fromValues(1, 1, 1), D_BLU:vec3.fromValues(0, 0, 0.5), D_GRN:vec3.fromValues(0, 0.5, 0), D_CYN:vec3.fromValues(0, 0.5, 0.5), D_RED:vec3.fromValues(0.5, 0, 0), D_PNK:vec3.fromValues(0.5, 0, 0.5), D_YLW:vec3.fromValues(0.5, 0.5, 0), L_BLU:vec3.fromValues(0.5, 0.5, 1), L_GRN:vec3.fromValues(0.5, 1, 0.5), L_CYN:vec3.fromValues(0.5, 1, 1), L_RED:vec3.fromValues(1, 0.5, 0.5), L_PNK:vec3.fromValues(1, 0.5, 1), L_YLW:vec3.fromValues(1, 1, 0.5)});
function main() {
	const canvas = document.getElementById("glCanvas");
	const gl = canvas.getContext("webgl", {preserveDrawingBuffer: true});
	if (!gl) {
		alert("Unable to initialize WebGL. Your browser or machine may not support it.");
		return;
	}
	const scene = new Scene(gl);
	const world = new CoordSystem("World", [Color.RED, Color.GRN, Color.BLU], mat4.create());

	// Declararea primitivelor
	const p1 = new Point("P1", Color.L_PNK, vec3.fromValues(-0.5, -0.5, 0.5));
	const p2 = new Point("P2", Color.D_BLU, vec3.fromValues(0.5, -0.5, 0.5));
	const p3 = new Point("P3", Color.YLW, vec3.fromValues(0.5, 0.5, 0.5));
	const p4 = new Point("P4", Color.WHT, vec3.fromValues(-0.5, 0.5, 0.5));
	const p5 = new Point("P5", Color.D_CYN, vec3.fromValues(-0.5, -0.5, -0.5));
	const p6 = new Point("P6", Color.L_RED, vec3.fromValues(0.5, -0.5, -0.5));
	const p7 = new Point("P7", Color.D_PNK, vec3.fromValues(0.5, 0.5, -0.5));
	const p8 = new Point("P8", Color.GRN, vec3.fromValues(-0.5, 0.5, -0.5));
	const s1 = new Segment("S1", Color.L_BLU, p1, p2);
	const s2 = new Segment("S2", Color.RED, p1, p4);
	const s3 = new Segment("S3", Color.L_GRN, p1, p5);
	const s4 = new Segment("S4", Color.BLK, p2, p3);
	const s5 = new Segment("S5", Color.L_YLW, p2, p6);
	const s6 = new Segment("S6", Color.YLW, p3, p4);
	const s7 = new Segment("S7", Color.CYN, p3, p7);
	const s8 = new Segment("S8", Color.D_GRN, p4, p8);
	const s9 = new Segment("S9", Color.WHT, p5, p6);
	const s10 = new Segment("S10", Color.L_RED, p5, p8);
	const s11 = new Segment("S11", Color.D_BLU, p6, p7);
	const s12 = new Segment("S12", Color.D_RED, p7, p8);

	// Structura ierarhiei primitivelor
	{
		world.add(s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12);
	}

	// Post-procesare:
	document.getElementById("slider1").addEventListener("input", function(e) {
		const val = this.value-1;
		p1.position[0] = val;
	});
	document.getElementById("slider2").addEventListener("input", function(e) {
		const val = this.value-1;
		p2.position[1] = val;
	});
	document.getElementById("slider3").addEventListener("input", function(e) {
		const val = this.value;
		p3.position[2] = val;
	});
	document.getElementById("slider4").addEventListener("input", function(e) {
		const val = this.value-1;
		p4.position[0] = val;
	});
	document.getElementById("slider5").addEventListener("input", function(e) {
		const val = this.value-1;
		p5.position[1] = val;
	});
	document.getElementById("slider6").addEventListener("input", function(e) {
		const val = this.value-1;
		p6.position[2] = val;
	});
	document.getElementById("slider7").addEventListener("input", function(e) {
		const val = this.value;
		p7.position[0] = val;
	});
	document.getElementById("slider8").addEventListener("input", function(e) {
		const val = this.value;
		p8.position[1] = val;
	});

	scene.insert(world);
	scene.render();
}