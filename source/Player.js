class Player {
	constructor(projection, position, xBasis, yBasis, zBasis) {
		this.projection = projection
		this.position = position
		this.xBasis = normalize(xBasis)
		this.yBasis = normalize(yBasis)
		this.zBasis = normalize(zBasis)
		this.setCamera()
	}

	setCamera() {
		let rotation = mat4(
			this.xBasis[0], this.xBasis[1], this.xBasis[2], 0,
			this.yBasis[0], this.yBasis[1], this.yBasis[2], 0,
			this.zBasis[0], this.zBasis[1], this.zBasis[2], 0,
			0, 0, 0, 1
		)
		let translation = translate(-this.position[0], -this.position[1], -this.position[2])
		this.camera = mult(rotation, translation)
	}

	getProjection() { return this.projection }

	getCamera() { return this.camera }
}
