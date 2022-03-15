class Light {
    constructor(direction, ambient, diffuse, specular, camera) {
    	this.direction = direction
    	this.ambient = ambient
    	this.diffuse = diffuse
    	this.specular = specular
		this.camera = camera
    }

	getProperties() { return [this.direction, this.ambient, this.diffuse, this.specular, this.camera] }
}
