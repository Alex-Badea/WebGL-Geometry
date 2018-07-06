window.onload = main;

function main() {
	const canvas = document.getElementById("glCanvas");
	const gl = canvas.getContext("webgl", {preserveDrawingBuffer: true});
	if (!gl) {
		alert("Unable to initialize WebGL. Your browser or machine may not support it.");
		return;
	}
	
	const scene = new Scene(gl);
	const p1 = new Point("P1", vec3.fromValues(0, 0, 1), vec3.fromValues(-0.5, -0.5, 0.5));
	const p2 = new Point("P2", vec3.fromValues(0, 1, 0), vec3.fromValues(0.5, -0.5, 0.5));
	const p3 = new Point("P3", vec3.fromValues(0, 1, 1), vec3.fromValues(0.5, 0.5, 0.5));
	const p4 = new Point("P4", vec3.fromValues(1, 0, 0), vec3.fromValues(-0.5, 0.5, 0.5));
	const p5 = new Point("P5", vec3.fromValues(1, 0, 1), vec3.fromValues(-0.5, -0.5, -0.5));
	const p6 = new Point("P6", vec3.fromValues(1, 1, 0), vec3.fromValues(0.5, -0.5, -0.5));
	const p7 = new Point("P7", vec3.fromValues(1, 1, 1), vec3.fromValues(0.5, 0.5, -0.5));
	const p8 = new Point("P8", vec3.fromValues(0, 0, 0), vec3.fromValues(-0.5, 0.5, -0.5));
	const t1 = new Triangle("", vec3.fromValues(1, 0, 0), p1, p2, p3);
	const t2 = new Triangle("", vec3.fromValues(1, 0, 0), p1, p3, p4);
	const t3 = new Triangle("", vec3.fromValues(0, 1, 0), p5, p6, p7);
	const t4 = new Triangle("", vec3.fromValues(0, 1, 0), p5, p7, p8);
	const t5 = new Triangle("", vec3.fromValues(0, 0, 1), p5, p1, p4);
	const t6 = new Triangle("", vec3.fromValues(0, 0, 1), p5, p4, p8);	
	const t7 = new Triangle("", vec3.fromValues(0, 0.5, 0.5), p2, p6, p7);
	const t8 = new Triangle("", vec3.fromValues(0, 0.5, 0.5), p2, p7, p3);	
	const world = new CoordSystem("World", vec3.fromValues(0, 0, 0), mat4.fromValues(1, 0, 0, 0,
																					0, 1, 0, 0,
																					0, 0, 1, 0,
																					0, 0, 0, 1));
	{
		const v1 = new Vector("v1", vec3.fromValues(0, 1, 0), p1);
		const cs1 = new CoordSystem("cs1", vec3.fromValues(0.5, 0, 1), mat4.fromValues(0.2, 0, 0, 0,
																						0, 0.2, 0, 0,
																						0, 0, 0.2, 0,
																						0.3, 0.3, 0.3, 1));
		{
			cs1.add(v1);
			cs1.add(p1);
			cs1.add(p2);
			cs1.add(p3);
			cs1.add(p4);
			cs1.add(p5);
			cs1.add(p6);
			cs1.add(p7);
			cs1.add(p8)
			cs1.add(t1);
			cs1.add(t2);
			cs1.add(t3);
			cs1.add(t4);
			cs1.add(t5);
			cs1.add(t6);
			cs1.add(t7);
			cs1.add(t8);
		}
		world.add(cs1);
		const cs2 = new CoordSystem("cs2", vec3.fromValues(0, 0.5, 1), mat4.fromValues(0.3, 0, 0, 0,
																						0, 0.3, 0, 0,
																						0, 0, 0.3, 0,
																						-0.3, 0.3, 0.3, 1));
		{
			cs2.add(v1);
			cs2.add(t1);
			cs2.add(t2);
			cs2.add(t3);
			cs2.add(t4);
			cs2.add(t5);
			cs2.add(t6);
			cs2.add(t7);
			cs2.add(t8);
			const cs3 = new CoordSystem("cs3", vec3.fromValues(1, 0.5, 1), mat4.fromValues(0.5, 0, 0, 0,
																							0, 0.5, 0, 0,
																							0, 0, 0.5, 0,
																							0, 0.3, 0, 1));
			{
				cs3.add(v1);
				cs3.add(t1);
				cs3.add(t2);
				cs3.add(t3);
				cs3.add(t4);
				cs3.add(t5);
				cs3.add(t6);
				cs3.add(t7);
				cs3.add(t8);
			}
			cs2.add(cs3);
		}
		world.add(cs2);
	}
	scene.insert(world);
	scene.render();
}