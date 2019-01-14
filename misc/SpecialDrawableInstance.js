class SpecialDrawableInstance {
	constructor(drawable, gl, defaultProgramInfo) {
		if (drawable == undefined || gl == undefined || defaultProgramInfo == undefined)
			throw new Error("Undefined or null params");
		this.drawable = drawable;
		this.gl = gl;
		this.defaultProgramInfo = defaultProgramInfo;
		this.buffers = {
			position: gl.createBuffer(),
			normal: gl.createBuffer(),
			color: gl.createBuffer(),
			texture: gl.createTexture(),
			texCoord: gl.createBuffer(),
			index: gl.createBuffer()
 		};
	}

	draw() {
		// Dezleagă programul implicit
		this.overrideDefaultShaders();

		// Desenează în noul context
		this.drawDefault();
		
		// Releagă programul implicit
		this.gl.useProgram(this.defaultProgramInfo.program);	
	}
	
	drawDefault() {
		if (this.gl.getUniform(this.currentProgramInfo.program, this.currentProgramInfo.uniformLocations.modelMatrix, 0).
		every((e, i) => mat4.fromValues(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0)[i] === e))
			throw new Error("Stray specialDrawable not bound to any drawing context (coordinate system)");

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.position);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.drawable.positions.map(e => Array.from(e)).flat()), this.gl.STATIC_DRAW);
		this.gl.vertexAttribPointer(this.currentProgramInfo.attribLocations.vertexPosition, 3, this.gl.FLOAT, false, 0, 0);
		this.gl.enableVertexAttribArray(this.currentProgramInfo.attribLocations.vertexPosition);
		
		if (this.drawable.normals.length)
			throw Error("Unimplemented")

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.color);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array((this.drawable.colors.length ? this.drawable.colors : [...Array(this.drawable.positions.length)].map(e => [Math.random(), Math.random(), Math.random(), Math.random()])).map(e => Array.from(e).concat(1)).flat()), this.gl.STATIC_DRAW);
		this.gl.vertexAttribPointer(this.currentProgramInfo.attribLocations.vertexColor, 4, this.gl.FLOAT, false, 0, 0);
		this.gl.enableVertexAttribArray(this.currentProgramInfo.attribLocations.vertexColor);

		this.gl.activeTexture(this.gl.TEXTURE0);
		this.gl.bindTexture(this.gl.TEXTURE_2D, this.buffers.texture);
		if (this.drawable.texInfo.image)
			this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.drawable.texInfo.image);
		else
			this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, 2, 2, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, new Uint8Array([255,0,0,255,0,0,255,255,0,0,255,255,255,0,0,255]));
       	this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
       	this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
       	this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
       	this.gl.uniform1i(this.currentProgramInfo.uniformLocations.sampler, 0);

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.texCoord);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array((this.drawable.texInfo.coords.length ? this.drawable.texInfo.coords : [...Array(this.drawable.positions.length)].map(e => [Math.random(), Math.random()])).map(e => Array.from(e)).flat()), this.gl.STATIC_DRAW);
		this.gl.vertexAttribPointer(this.currentProgramInfo.attribLocations.vertexTexCoord, 2, this.gl.FLOAT, false, 0, 0);
		this.gl.enableVertexAttribArray(this.currentProgramInfo.attribLocations.vertexTexCoord);

		if (this.buffers.index.length != 0) {
			this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffers.index);
			this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.drawable.faces.map(e => Array.from(e)).flat()), this.gl.STATIC_DRAW);
			this.gl.drawElements(this.gl.TRIANGLES, this.drawable.faces.length*3, this.gl.UNSIGNED_SHORT, 0);
		} else {
			this.gl.drawArrays(this.gl.POINTS, 0, this.drawable.positions.length);
		}
	}

	overrideDefaultShaders() {
		const modelMatrix = this.gl.getUniform(this.defaultProgramInfo.program, this.defaultProgramInfo.uniformLocations.modelMatrix, 0);
		const viewMatrix = this.gl.getUniform(this.defaultProgramInfo.program, this.defaultProgramInfo.uniformLocations.viewMatrix, 0);
		const projectionMatrix = this.gl.getUniform(this.defaultProgramInfo.program, this.defaultProgramInfo.uniformLocations.projectionMatrix, 0);

		const program = this.initShaderProgram();
		this.currentProgramInfo = {
			program,
			attribLocations: {
				vertexPosition: this.gl.getAttribLocation(program, 'aVertexPosition'),
				vertexNormal: this.gl.getAttribLocation(program, 'aVertexNormal'),
				vertexColor: this.gl.getAttribLocation(program, 'aVertexColor'),
				vertexTexCoord: this.gl.getAttribLocation(program, 'aVertexTexCoord'),
			},
			uniformLocations: {
				projectionMatrix: this.gl.getUniformLocation(program, 'uProjectionMatrix'),
				viewMatrix: this.gl.getUniformLocation(program, 'uViewMatrix'),
				modelMatrix: this.gl.getUniformLocation(program, 'uModelMatrix'),
				useNormal: this.gl.getUniformLocation(program, 'uUseNormal'),
				useColor: this.gl.getUniformLocation(program, 'uUseColor'),
				useTexture: this.gl.getUniformLocation(program, 'uUseTexture'),
				sampler: this.gl.getUniformLocation(program, 'uSampler'),
			}
		};
		// Transferă informație între shader-e
		this.gl.uniformMatrix4fv(this.currentProgramInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
		this.gl.uniformMatrix4fv(this.currentProgramInfo.uniformLocations.viewMatrix, false, viewMatrix);
		this.gl.uniformMatrix4fv(this.currentProgramInfo.uniformLocations.modelMatrix, false, modelMatrix);

		this.gl.uniform1i(this.currentProgramInfo.uniformLocations.useNormal, this.drawable.normals.length != 0);
		this.gl.uniform1i(this.currentProgramInfo.uniformLocations.useColor, this.drawable.colors.length != 0);
		this.gl.uniform1i(this.currentProgramInfo.uniformLocations.useTexture, this.drawable.texInfo.coords.length != 0);
	}

	initShaderProgram() {
		const gl = this.gl;
		const vsSource = `
			attribute vec3 aVertexPosition;
			//attribute vec3 aVertexNormal;
			attribute vec4 aVertexColor;
			attribute vec2 aVertexTexCoord;

			uniform bool uUseNormal;
			uniform bool uUseColor;
			uniform bool uUseTexture;
		
			uniform mat4 uModelMatrix;
			uniform mat4 uViewMatrix;
			uniform mat4 uProjectionMatrix;
		
			varying lowp vec4 vVertexColor;
			varying highp vec2 vVertexTexCoord;
			varying lowp float vUseNormal;
			varying lowp float vUseColor;
			varying lowp float vUseTexture;
		
			void main(void) {
				gl_PointSize = 5.0;
				gl_Position = 
					uProjectionMatrix * 
					uViewMatrix * 
					uModelMatrix * 
					vec4(aVertexPosition, 1);

				vVertexColor = aVertexColor;
				vVertexTexCoord = aVertexTexCoord; 		

				vUseNormal = float(uUseNormal);
				vUseColor = float(uUseColor);
				vUseTexture = float(uUseTexture);
			}
		`;
		const fsSource = `
			uniform sampler2D uSampler;

			varying lowp vec4 vVertexColor;
			varying highp vec2 vVertexTexCoord;
			varying lowp float vUseNormal;
			varying lowp float vUseColor;
			varying lowp float vUseTexture;
        
			void main(void) {
				lowp vec4 colorPart = vUseColor*vVertexColor;
				lowp vec4 texPart = vUseTexture*texture2D(uSampler, vVertexTexCoord);
				gl_FragColor = (colorPart + texPart)/(vUseColor + vUseTexture);
				if (vUseColor<0.5 && vUseTexture<0.5) gl_FragColor = vec4(0,0,0,1);
			}
		`;
		
		const shaderProgram = gl.createProgram();
		const vertexShader = this.loadShader(gl.VERTEX_SHADER, vsSource);
		const fragmentShader = this.loadShader(gl.FRAGMENT_SHADER, fsSource);
		
		gl.attachShader(shaderProgram, vertexShader);
		gl.attachShader(shaderProgram, fragmentShader);
		gl.linkProgram(shaderProgram);
		gl.useProgram(shaderProgram);
		gl.detachShader(shaderProgram, fragmentShader);
		gl.detachShader(shaderProgram, vertexShader);
		gl.deleteShader(fragmentShader);
		gl.deleteShader(vertexShader);
		
		if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
			alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
			return null;
		}

		return shaderProgram;
	}
	
	loadShader(type, source) {
		const gl = this.gl;
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

	erase() {} 
}