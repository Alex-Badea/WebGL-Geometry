window.onload = main;

const Colors = Object.freeze({BLK:vec3.fromValues(0, 0, 0), BLU:vec3.fromValues(0, 0, 1), GRN:vec3.fromValues(0, 1, 0), CYN:vec3.fromValues(0, 1, 1), RED:vec3.fromValues(1, 0, 0), PNK:vec3.fromValues(1, 0, 1), YLW:vec3.fromValues(1, 1, 0), WHT:vec3.fromValues(1, 1, 1), D_BLU:vec3.fromValues(0, 0, 0.5), D_GRN:vec3.fromValues(0, 0.5, 0), D_CYN:vec3.fromValues(0, 0.5, 0.5), D_RED:vec3.fromValues(0.5, 0, 0), D_PNK:vec3.fromValues(0.5, 0, 0.5), D_YLW:vec3.fromValues(0.5, 0.5, 0), L_BLU:vec3.fromValues(0.5, 0.5, 1), L_GRN:vec3.fromValues(0.5, 1, 0.5), L_CYN:vec3.fromValues(0.5, 1, 1), L_RED:vec3.fromValues(1, 0.5, 0.5), L_PNK:vec3.fromValues(1, 0.5, 1), L_YLW:vec3.fromValues(1, 1, 0.5)});

function main() {
	const canvas = document.getElementById("glCanvas");
	const gl = canvas.getContext("webgl", {preserveDrawingBuffer: true});
	if (!gl) {
		alert("Unable to initialize WebGL. Your browser or machine may not support it.");
		return;
	}
	
	const scene = new Scene(gl);
	const p1 = new Point("P1", Colors.L_PNK, vec3.fromValues(-0.5, -0.5, 0.5));
	const p2 = new Point("P2", Colors.L_GRN, vec3.fromValues(0.5, -0.5, 0.5));
	const p3 = new Point("P3", Colors.D_GRN, vec3.fromValues(0.5, 0.5, 0.5));
	const p4 = new Point("P4", Colors.RED, vec3.fromValues(-0.5, 0.5, 0.5));
	const p5 = new Point("P5", Colors.BLU, vec3.fromValues(-0.5, -0.5, -0.5));
	const p6 = new Point("P6", Colors.PNK, vec3.fromValues(0.5, -0.5, -0.5));
	const p7 = new Point("P7", Colors.D_RED, vec3.fromValues(0.5, 0.5, -0.5));
	const p8 = new Point("P8", Colors.L_RED, vec3.fromValues(-0.5, 0.5, -0.5));
	const t1 = new Triangle("", Colors.L_YLW, p1, p2, p3);
	const t2 = new Triangle("", Colors.L_YLW, p1, p3, p4);
	const t3 = new Triangle("", Colors.D_PNK, p5, p6, p7);
	const t4 = new Triangle("", Colors.D_PNK, p5, p7, p8);
	const t5 = new Triangle("", Colors.RED, p5, p1, p4);
	const t6 = new Triangle("", Colors.RED, p5, p4, p8);	
	const t7 = new Triangle("", Colors.BLU, p2, p6, p7);
	const t8 = new Triangle("", Colors.BLU, p2, p7, p3);
	const cs1 = new CoordSystem("cs1", vec3.fromValues(0, 0, 0), mat4.mul(mat4.create(), mat4.fromRotation(mat4.create(), glMatrix.toRadian(45), vec3.fromValues(1,1,1)), mat4.mul(mat4.create(), mat4.fromTranslation(mat4.create(), vec3.fromValues(1.5,0,0)), mat4.fromScaling(mat4.create(), vec3.fromValues(1,0.3,0.5)))));
	
	const world = new CoordSystem("World", vec3.fromValues(0, 0, 0), mat4.create());
	{
		world.add(p1, p2, p3, p4, p5, p6, p7, p8);
		world.add(t1, t2, t3, t4, t5, t6, t7, t8);
		{
			cs1.add(p1, p2, p3, p4, p5, p6, p7, p8);
			cs1.add(t1, t2, t3, t4, t5, t6, t7, t8);
		}
		world.add(cs1);
	}
	scene.insert(world);
	scene.render();
}