class Scene {
	constructor(gl) {
		if (gl == undefined)
			throw Error("Undefined or null params");
		const program = this.initShaderProgram(gl);
		
		this.gl = gl;
		this.drawList = [];
		this.programInfo = {
			program,
			attribLocations: {
				vertexPosition: gl.getAttribLocation(program, 'aVertexPosition'),
				vertexColor: gl.getAttribLocation(program, 'aVertexColor'),
			},
			uniformLocations: {
				projectionMatrix: gl.getUniformLocation(program, 'uProjectionMatrix'),
				viewMatrix: gl.getUniformLocation(program, 'uViewMatrix'),
				modelMatrix: gl.getUniformLocation(program, 'uModelMatrix'),
			}
		};
		this.fov = 60;
		this.aspect = gl.canvas.width/gl.canvas.height;
		this.zNear = 0.1;
		this.zFar = 100;
		this.eyePos = vec3.fromValues(0,0,1);
		this.lookPos = vec3.fromValues(0,0,0);
		this.upDir = vec3.fromValues(0,1,0);
		this.inputState = {mouseDown: false};
		
		document.onmouseup = e => this.inputState.mouseDown = false;
		document.onmousedown = e => this.inputState.mouseDown = true;
		let lastMousePos = [0, 0];
		gl.canvas.onmousemove = e => {
			if (this.inputState.mouseDown) {
				const deltaX = e.clientX - lastMousePos[0];
				const deltaY = e.clientY - lastMousePos[1];
				let frontDir = vec3.normalize(vec3.create(), vec3.negate(vec3.create(), this.eyePos));
				let leftDir = vec3.normalize(vec3.create(), vec3.cross(vec3.create(), this.upDir, frontDir));
				
				const rotLeftMat = mat4.fromRotation(mat4.create(), -deltaX*0.01, this.upDir);
				const rotUpMat = mat4.fromRotation(mat4.create(), deltaY*0.01, leftDir);
				this.eyePos = vec3.transformMat4(vec3.create(), this.eyePos, rotLeftMat);
				this.eyePos = vec3.transformMat4(vec3.create(), this.eyePos, rotUpMat);
				frontDir = vec3.normalize(vec3.create(), vec3.negate(vec3.create(), this.eyePos));
				leftDir = vec3.normalize(vec3.create(), vec3.cross(vec3.create(), this.upDir, frontDir));
				// Se va regenera upDir degenerat?
				//upDir = vec3.normalize(vec3.create(), vec3.cross(vec3.create(), frontDir, leftDir));
			}
			lastMousePos = vec2.fromValues(e.clientX, e.clientY);
		};
		gl.canvas.onwheel = e => {
			e.preventDefault();
			let frontDir = vec3.normalize(vec3.create(), vec3.negate(vec3.create(), this.eyePos));
			this.eyePos = vec3.add(vec3.create(), this.eyePos, vec3.scale(vec3.create(), frontDir, -e.deltaY*0.001));
		};
		document.onkeypress = e => {
			switch (e.key) {
			case 'p':
				const rect = this.gl.canvas.getBoundingClientRect();
				html2canvas(document.body, {x:rect.x, y:rect.y, height:rect.height, width:rect.width}).then(canvas => {
					canvas.left = 30;
					canvas.top = 30;
					const url = canvas.toDataURL("image/png");
					const link = document.createElement('a');
					link.href = url;
					link.download = 'Scene.png';
					document.body.appendChild(link);
					link.click();
				});
				break;
			}
		}
	}
	
	insert(drawable) {
		for (let i = 0; i < arguments.length; i++)
			this.drawList.push(arguments[i].instantiate(this.gl, this.programInfo));
	}
	
	render() {
		const render = () => {
			this.renderFrame();
			window.requestAnimationFrame(render);
		};
		render();
	}
	
	renderFrame() {
		this.gl.clearColor(0.5, 0.5, 0.5, 1.0);  
		this.gl.clearDepth(1.0); 
		this.gl.enable(this.gl.DEPTH_TEST);
		this.gl.enable(this.gl.BLEND);
		this.gl.blendEquation(this.gl.FUNC_ADD);		
		this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA );
		this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
		
		// Per Scene:
		const projectionMatrix = mat4.perspective(mat4.create(), glMatrix.toRadian(this.fov), this.aspect, this.zNear, this.zFar);
		const viewMatrix = mat4.lookAt(mat4.create(), this.eyePos, this.lookPos, this.upDir);

		this.gl.useProgram(this.programInfo.program);
		this.gl.uniformMatrix4fv(this.programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
		this.gl.uniformMatrix4fv(this.programInfo.uniformLocations.viewMatrix, false, viewMatrix);
				
		// Per Drawable:
		for (const e of this.drawList) {
			this.gl.uniformMatrix4fv(this.programInfo.uniformLocations.modelMatrix, false, mat4.create());
			e.draw(this.programInfo);
		}
		
		// Per Scene:
		this.gl.uniformMatrix4fv(this.programInfo.uniformLocations.projectionMatrix, false, mat4.fromValues(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0));
		this.gl.uniformMatrix4fv(this.programInfo.uniformLocations.viewMatrix, false, mat4.fromValues(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0));
		this.gl.uniformMatrix4fv(this.programInfo.uniformLocations.modelMatrix, false, mat4.fromValues(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0));
	}
	
	initShaderProgram(gl) {
		const vsSource = `
			attribute vec4 aVertexPosition;
			attribute vec4 aVertexColor;
		
			uniform mat4 uModelMatrix;
			uniform mat4 uViewMatrix;
			uniform mat4 uProjectionMatrix;
		
			varying lowp vec4 vColor;
		
			void main(void) {
				gl_PointSize = 5.0;
				gl_Position = 
					uProjectionMatrix * 
					uViewMatrix * 
					uModelMatrix * 
					aVertexPosition;
				vColor = aVertexColor;
			}
		`;
		
		const fsSource = `
			varying lowp vec4 vColor;
        
			void main(void) {
				gl_FragColor = vColor;
			}
		`;
		
		const vertexShader = this.loadShader(gl, gl.VERTEX_SHADER, vsSource);
		const fragmentShader = this.loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
		
		const shaderProgram = gl.createProgram();
		gl.attachShader(shaderProgram, vertexShader);
		gl.attachShader(shaderProgram, fragmentShader);
		gl.linkProgram(shaderProgram);
		
		if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
			alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
			return null;
		}
		
		return shaderProgram;
	}
	
	loadShader(gl, type, source) {
		const shader = gl.createShader(type);
		
		gl.shaderSource(shader, source);
		
		gl.compileShader(shader);
		
		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
			gl.deleteShader(shader);
			return null;
		}
		
		return shader;
	}
}