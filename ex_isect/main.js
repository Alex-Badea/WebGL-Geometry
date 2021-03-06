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
	const p1 = new Point("P1", Color.L_RED, vec3.fromValues(0.2, 0.3, -0.2));
	const p2 = new Point("P2", Color.L_GRN, vec3.fromValues(1, 0.6, 0));
	const p3 = new Point("P3", Color.L_BLU, vec3.fromValues(0, 2, 1));
	const p4 = new Point("P4", Color.L_YLW, vec3.fromValues(0.5, 1.4, 0));
	const p5 = new Point("P5", Color.L_CYN, vec3.fromValues(0.4, 0.1, 0.8));
	const p6 = new Point("P6", Color.L_PNK, vec3.fromValues(0.5, 0.4, -0.5));
	const p7 = new Point("P7", Color.BLK, vec3.fromValues(0.6, 0.6, 0.3));
	const t1 = new Triangle("T1", Color.BLU, p1, p2, p3);
	const t2 = new Triangle("T2", Color.RED, p4, p5, p6);
	const v1 = new Vector("V1", Color.PNK, p7);

	// Structura ierarhiei primitivelor
	{
		world.add(p1, p2, p3, p4, p5, p6);
		world.add(t1, t2);
		world.add(t1.intersect(t2, "T1 intersectat cu T2", Color.L_YLW));
		world.add(v1);
		world.add(t2.intersect(v1));
	}

	// Post-procesare:
	/*NIMIC*/

	scene.insert(world);
	scene.render();
}