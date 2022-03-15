class Polygon {
    constructor(vertices, faces, normal, textureCoordinates) {
		this.transformation = mat4(
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		)
		this.vertices = vertices
		this.faces = faces
		this.ambient = vec4(0, 0, 0, 0)
		this.diffuse = vec4(1, 1, 1, 1)
		this.specular = vec4(1, 1, 1, 1)
		this.alpha = 100.0
		this.normal = normal
		this.textureCoordinates = textureCoordinates
    }

	setTransformation(transformation) {
        let translation = translate(transformation[0], transformation[1], transformation[2])
    	let scaler = scale(transformation[3], transformation[4], transformation[5])
    	let xRotation = rotateX(transformation[6])
    	let yRotation = rotateY(transformation[7])
    	let zRotation = rotateZ(transformation[8])
        let center = translate(-transformation[9], -transformation[10], -transformation[11])
        let anticenter = translate(transformation[9], transformation[10], transformation[11])
		this.transformation = mult(translation, mult(anticenter, mult(scaler, mult(xRotation, mult(yRotation, mult(zRotation, center))))))
	}

    draw(webgl, shader, player, light, texture, depthTexture) {
		webgl.useProgram(shader)

		webgl.uniformMatrix4fv(webgl.getUniformLocation(shader, 'shadow'), false, flatten(light.getProperties()[4].getCamera()))
		webgl.uniformMatrix4fv(webgl.getUniformLocation(shader, 'projection'), false, flatten(player.getProjection()))
		webgl.uniformMatrix4fv(webgl.getUniformLocation(shader, 'camera'), false, flatten(player.getCamera()))
		webgl.uniformMatrix4fv(webgl.getUniformLocation(shader, 'transformation'), false, flatten(this.transformation))
		let position = webgl.getAttribLocation(shader, 'position')
        webgl.bindBuffer(webgl.ARRAY_BUFFER, webgl.createBuffer())
		webgl.bufferData(webgl.ARRAY_BUFFER, flatten(this.vertices), webgl.STATIC_DRAW)
        webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, webgl.createBuffer())
		webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, new Uint32Array(this.faces), webgl.STATIC_DRAW)
       	webgl.vertexAttribPointer(position, 3, webgl.FLOAT, false, 0, 0)

		webgl.uniform3fv(webgl.getUniformLocation(shader, 'lightDirection'), light.getProperties()[0])
		webgl.uniform4fv(webgl.getUniformLocation(shader, 'lightAmbient'), light.getProperties()[1])
		webgl.uniform4fv(webgl.getUniformLocation(shader, 'lightDiffuse'), light.getProperties()[2])
		webgl.uniform4fv(webgl.getUniformLocation(shader, 'lightSpecular'), light.getProperties()[3])
		webgl.uniform4fv(webgl.getUniformLocation(shader, 'objectAmbient'), this.ambient)
		webgl.uniform4fv(webgl.getUniformLocation(shader, 'objectDiffuse'), this.diffuse)
		webgl.uniform4fv(webgl.getUniformLocation(shader, 'objectSpecular'), this.specular)
		webgl.uniform1f(webgl.getUniformLocation(shader, 'objectAlpha'), this.alpha)
		let normal = webgl.getAttribLocation(shader, 'normal')
		webgl.bindBuffer(webgl.ARRAY_BUFFER, webgl.createBuffer())
		webgl.bufferData(webgl.ARRAY_BUFFER, flatten(this.normal), webgl.STATIC_DRAW)
       	webgl.vertexAttribPointer(normal, 3, webgl.FLOAT, false, 0, 0)

		webgl.uniform1i(webgl.getUniformLocation(shader, 'objectTexture'), 0)
       	webgl.activeTexture(webgl.TEXTURE0)
       	webgl.bindTexture(webgl.TEXTURE_2D, texture)
		webgl.uniform1i(webgl.getUniformLocation(shader, 'depthTexture'), 1)
		webgl.activeTexture(webgl.TEXTURE1)
		webgl.bindTexture(webgl.TEXTURE_2D, depthTexture)
		let textureCoordinate = webgl.getAttribLocation(shader, 'vTextureCoordinate')
		webgl.bindBuffer(webgl.ARRAY_BUFFER, webgl.createBuffer())
		webgl.bufferData(webgl.ARRAY_BUFFER, flatten(this.textureCoordinates), webgl.STATIC_DRAW)
       	webgl.vertexAttribPointer(textureCoordinate, 2, webgl.FLOAT, false, 0, 0)

		webgl.enableVertexAttribArray(position)
		webgl.enableVertexAttribArray(normal)
		webgl.enableVertexAttribArray(textureCoordinate)
    	webgl.drawElements(webgl.TRIANGLES, this.faces.length, webgl.UNSIGNED_INT, 0)
		webgl.disableVertexAttribArray(position)
		webgl.disableVertexAttribArray(normal)
		webgl.disableVertexAttribArray(textureCoordinate)
    }

	drawShadow(webgl, shader, light) {
		webgl.useProgram(shader)

		webgl.uniformMatrix4fv(webgl.getUniformLocation(shader, 'projection'), false, flatten(light.getProperties()[4].getProjection()))
		webgl.uniformMatrix4fv(webgl.getUniformLocation(shader, 'camera'), false, flatten(light.getProperties()[4].getCamera()))
		webgl.uniformMatrix4fv(webgl.getUniformLocation(shader, 'transformation'), false, flatten(this.transformation))
		let position = webgl.getAttribLocation(shader, 'position')
        webgl.bindBuffer(webgl.ARRAY_BUFFER, webgl.createBuffer())
		webgl.bufferData(webgl.ARRAY_BUFFER, flatten(this.vertices), webgl.STATIC_DRAW)
        webgl.bindBuffer(webgl.ELEMENT_ARRAY_BUFFER, webgl.createBuffer())
		webgl.bufferData(webgl.ELEMENT_ARRAY_BUFFER, new Uint32Array(this.faces), webgl.STATIC_DRAW)
       	webgl.vertexAttribPointer(position, 3, webgl.FLOAT, false, 0, 0)

		webgl.enableVertexAttribArray(position)
    	webgl.drawElements(webgl.TRIANGLES, this.faces.length, webgl.UNSIGNED_INT, 0)
		webgl.disableVertexAttribArray(position)
	}
}
