window.onload = main;

const Colors = Object.freeze({BLK:vec3.fromValues(0, 0, 0), BLU:vec3.fromValues(0, 0, 1), GRN:vec3.fromValues(0, 1, 0), CYN:vec3.fromValues(0, 1, 1), RED:vec3.fromValues(1, 0, 0), PNK:vec3.fromValues(1, 0, 1), YLW:vec3.fromValues(1, 1, 0), WHT:vec3.fromValues(1, 1, 1), D_BLU:vec3.fromValues(0, 0, 0.5), D_GRN:vec3.fromValues(0, 0.5, 0), D_CYN:vec3.fromValues(0, 0.5, 0.5), D_RED:vec3.fromValues(0.5, 0, 0), D_PNK:vec3.fromValues(0.5, 0, 0.5), D_YLW:vec3.fromValues(0.5, 0.5, 0), L_BLU:vec3.fromValues(0.5, 0.5, 1), L_GRN:vec3.fromValues(0.5, 1, 0.5), L_CYN:vec3.fromValues(0.5, 1, 1), L_RED:vec3.fromValues(1, 0.5, 0.5), L_PNK:vec3.fromValues(1, 0.5, 1), L_YLW:vec3.fromValues(1, 1, 0.5)});

function main() {
	const canvas = document.getElementById("glCanvas");
	const gl = canvas.getContext("webgl", {preserveDrawingBuffer: true});
	if (!gl) throw Error("Unable to initialize WebGL. Your browser or machine may not support it.");
	
	const scene = new Scene(gl, {unlockRoll: true});
	const P1 = new CoordSystem("P1", [Colors.RED, Colors.GRN, Colors.BLU], mat4.multiply(mat4.create(), mat4.fromTranslation(mat4.create(), vec3.fromValues(-2,0,0)),
																										mat4.fromRotation(mat4.create(), Math.PI/9, vec3.fromValues(0,1,0))));
	const P2 = new CoordSystem("P2", [Colors.RED, Colors.GRN, Colors.BLU], mat4.multiply(mat4.create(), mat4.fromTranslation(mat4.create(), vec3.fromValues(2,0,0)),
																										mat4.fromRotation(mat4.create(), -Math.PI/9, vec3.fromValues(0,1,0))));



	const meshLoader = new PlyModelLoader("meshPlyInput", result => {
		scene.insert(new SpecialDrawableBlueprint(result.positions, [], result.colors, result.texInfo, result.faces));
		scene.redraw();
	});
	const im1Loader = new PlyModelLoader("rect1PlyInput", "im1TexInput", result => {
		P1.add(new SpecialDrawableBlueprint(result.positions, [], result.colors, result.texInfo, result.faces));
		scene.redraw();
	});
	const im2Loader = new PlyModelLoader("rect2PlyInput", "im2TexInput", result => {
		P2.add(new SpecialDrawableBlueprint(result.positions, [], result.colors, result.texInfo, result.faces));
		scene.redraw();
	});

	scene.insert(P1, P2);
	scene.render();
}