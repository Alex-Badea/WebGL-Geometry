window.onload = main;

const Colors = Object.freeze({BLK:vec3.fromValues(0, 0, 0), BLU:vec3.fromValues(0, 0, 1), GRN:vec3.fromValues(0, 1, 0), CYN:vec3.fromValues(0, 1, 1), RED:vec3.fromValues(1, 0, 0), PNK:vec3.fromValues(1, 0, 1), YLW:vec3.fromValues(1, 1, 0), WHT:vec3.fromValues(1, 1, 1), D_BLU:vec3.fromValues(0, 0, 0.5), D_GRN:vec3.fromValues(0, 0.5, 0), D_CYN:vec3.fromValues(0, 0.5, 0.5), D_RED:vec3.fromValues(0.5, 0, 0), D_PNK:vec3.fromValues(0.5, 0, 0.5), D_YLW:vec3.fromValues(0.5, 0.5, 0), L_BLU:vec3.fromValues(0.5, 0.5, 1), L_GRN:vec3.fromValues(0.5, 1, 0.5), L_CYN:vec3.fromValues(0.5, 1, 1), L_RED:vec3.fromValues(1, 0.5, 0.5), L_PNK:vec3.fromValues(1, 0.5, 1), L_YLW:vec3.fromValues(1, 1, 0.5)});

function main() {
	const canvas = document.getElementById("glCanvas");
	const gl = canvas.getContext("webgl", {preserveDrawingBuffer: true});
	if (!gl) throw Error("Unable to initialize WebGL. Your browser or machine may not support it.");

	const scene = new Scene(gl, {unlockRoll: true});
	const Mesh = new CoordSystem("Model", [vec3.fromValues(0.5,0.5,0.5), vec3.fromValues(0.5,0.5,0.5), vec3.fromValues(0.5,0.5,0.5)], mat4.multiply(mat4.create(),
																																 mat4.fromTranslation(mat4.create(), vec3.fromValues(0,-0.75,3.5)),
																																 mat4.fromScaling(mat4.create(), vec3.fromValues(1.2,1.2,1.2))));
	const P1 = new CoordSystem("P", [Colors.RED, Colors.GRN, Colors.BLU], mat4.multiply(mat4.create(), mat4.fromTranslation(mat4.create(), vec3.fromValues(-3.5,0.07,0)),
																										mat4.fromRotation(mat4.create(), Math.PI/4+0.11, vec3.fromValues(0,1,0))));
	const P2 = new CoordSystem("P'", [Colors.RED, Colors.GRN, Colors.BLU], mat4.multiply(mat4.create(), mat4.fromTranslation(mat4.create(), vec3.fromValues(3.5,0,0)),
																										mat4.fromRotation(mat4.create(), -Math.PI/4-0.05, vec3.fromValues(0,1,0))));
	const X = new Point("X", Colors.BLU, vec3.fromValues(-0.23,-3.09,2.95));
	const B = new Segment("Bază", Colors.D_PNK, new Point("", Colors.BLK, P1.modelMatrix.slice(12,14+1)), new Point("", Colors.BLK, P2.modelMatrix.slice(12,14+1)));
	const EP = new Triangle("Planul Epipolar", Colors.L_RED, new Point("", Colors.BLK, P1.modelMatrix.slice(12,14+1)), new Point("", Colors.BLK, P2.modelMatrix.slice(12,14+1)), new Point("", Colors.BLK, vec3.fromValues(0.95,-4.25,4.03)));

	const meshLoader = new PlyModelLoader("meshPlyInput", result => {
		Mesh.add(new SpecialDrawableBlueprint(result.positions, [], result.colors, result.texInfo, result.faces));
		scene.redraw();
	});
	const im1Loader = new PlyModelLoader("rect1PlyInput", "im1TexInput", result => {
		P1.add(new SpecialDrawableBlueprint(result.positions, [], result.colors, result.texInfo, result.faces));
		const R1 = new Vector("Rază", Colors.CYN, new Point("", Colors.BLK, vec3.fromValues(6*-0.06, 6*-0.72, 6)));

		P1.add(R1);
		// Triunghi fictiv pentru intersecții
		const newT1 = vec4.transformMat4(vec4.create(), vec4.fromValues(...result.positions[1], 1),
														P1.modelMatrix).slice(0, 2+1);
		const newT2 = vec4.transformMat4(vec4.create(), vec4.fromValues(...result.positions[2], 1),
														P1.modelMatrix).slice(0, 2+1);
		const newT3 = vec4.transformMat4(vec4.create(), vec4.fromValues(...result.positions[3], 1),
														P1.modelMatrix).slice(0, 2+1);
		const canonicalT = new Triangle("@@@", Colors.GRN, new Point("",Colors.BLK,newT1), new Point("",Colors.BLK,newT2), new Point("",Colors.BLK,newT3));
		//scene.insert(canonicalT.intersect(B, "e", Colors.YLW));
		const T = new Triangle("@@@#", Colors.GRN, new Point("",Colors.BLK,result.positions[1]), new Point("",Colors.BLK,result.positions[2]), new Point("",Colors.BLK,result.positions[3]))
		P1.add(T.intersect(R1, "x", Colors.D_RED));

		scene.redraw();
	});
	const im2Loader = new PlyModelLoader("rect2PlyInput", "im2TexInput", result => {
		P2.add(new SpecialDrawableBlueprint(result.positions, [], result.colors, result.texInfo, result.faces));
		const R2 = new Vector("Rază'", Colors.YLW, new Point("", Colors.BLK, vec3.fromValues(6*-0.06, 6*-0.65, 6)));
		P2.add(R2);
		// Triunghi fictiv pentru intersecții
		const newT1 = vec4.transformMat4(vec4.create(), vec4.fromValues(...result.positions[0], 1),
														P2.modelMatrix).slice(0, 2+1);
		const newT2 = vec4.transformMat4(vec4.create(), vec4.fromValues(...result.positions[2], 1),
														P2.modelMatrix).slice(0, 2+1);
		const newT3 = vec4.transformMat4(vec4.create(), vec4.fromValues(...result.positions[3], 1),
														P2.modelMatrix).slice(0, 2+1);
		const canonicalT = new Triangle("@@@", Colors.GRN, new Point("",Colors.BLK,newT1), new Point("",Colors.BLK,newT2), new Point("",Colors.BLK,newT3));
		//scene.insert(canonicalT.intersect(B, "e'", Colors.CYN));
		const I = canonicalT.intersect(EP, "l'", Colors.GRN);
		I.p1.position[2] -= 0.01;
		I.p2.position[2] -= 0.01;
		//scene.insert(I)
		const T = new Triangle("@@@#", Colors.GRN, new Point("",Colors.BLK,result.positions[0]), new Point("",Colors.BLK,result.positions[2]), new Point("",Colors.BLK,result.positions[3]))
		P2.add(T.intersect(R2, "x'", Colors.D_BLU));

		scene.redraw();
	});

	scene.insert(P1, P2, X, B, Mesh);
	//scene.insert(EP);
	scene.render();
}