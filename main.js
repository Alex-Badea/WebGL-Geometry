window.onload = main;

function main() {
	const canvas = document.getElementById("glCanvas");
	const gl = canvas.getContext("webgl");
	if (!gl) {
		alert("Unable to initialize WebGL. Your browser or machine may not support it.");
		return;
	}
	
	const scene = new Scene(gl);
	const p1 = new Point("A", vec3.fromValues(-0.5, -0.5, 0.5), vec3.fromValues(0, 0, 0));
	const p2 = new Point("B", vec3.fromValues(0.5, -0.5, 0.5), vec3.fromValues(0, 0, 1)); 
	scene.insert(p2);
	const p3 = new Point("C", vec3.fromValues(0.5, 0.5, 0.5), vec3.fromValues(0, 1, 0));
	const p4 = new Point("D", vec3.fromValues(-0.5, 0.5, 0.5), vec3.fromValues(0, 1, 1));
	const p5 = new Point("E", vec3.fromValues(-0.5, -0.5, -0.5), vec3.fromValues(1, 0, 0));
	const p6 = new Point("F", vec3.fromValues(0.5, -0.5, -0.5), vec3.fromValues(1, 0, 1));
	const p7 = new Point("G", vec3.fromValues(0.5, 0.5, -0.5), vec3.fromValues(1, 1, 0));
	const p8 = new Point("H", vec3.fromValues(-0.5, 0.5, -0.5), vec3.fromValues(1, 1, 1));
	
	const t1 = new Triangle("", p1, p2, p3);
	const t2 = new Triangle("", p1, p3, p4);
	const t3 = new Triangle("", p5, p6, p7);
	const t4 = new Triangle("", p5, p7, p8);
	const t5 = new Triangle("", p5, p1, p4);
	const t6 = new Triangle("", p5, p4, p8);
	const t7 = new Triangle("", p2, p6, p7);
	const t8 = new Triangle("", p2, p7, p3);
	
	const cs1 = new CoordSystem("World", mat4.fromValues(1, 0, 0, 0,
														 0, 1, 0, 0,
														 0, 0, 1, 0,
														 0, 0, 0, 1));
	cs1.add(t1);	
	cs1.add(t2);
	cs1.add(t3);
	cs1.add(t4);
	cs1.add(t5);
	cs1.add(t6);
	cs1.add(t7);
	cs1.add(t8);
	scene.insert(cs1);
												   
	const cs2 = new CoordSystem("cs2", mat4.fromValues(2, 0, 0, 0,
													   0, 1, 0, 0,
													   0, 0, 1, 0,
													   0.5, 1, 0.5, 1));
	cs2.add(t1);	
	cs2.add(t2);
	cs2.add(t3);
	cs2.add(t4);
	cs2.add(t5);
	cs2.add(t6);
	cs2.add(t7);
	cs2.add(t8);	
	scene.insert(cs2);												   
	scene.render();
}