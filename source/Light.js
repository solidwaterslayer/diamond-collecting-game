class Light {
	constructor(direction, ambient, diffuse, specular) {
		this.direction = direction
		this.ambient = ambient
		this.diffuse = diffuse
		this.specular = specular
	}

	getProperties() { return [this.direction, this.ambient, this.diffuse, this.specular] }
}
