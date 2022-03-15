function getWebgl() {
    let canvas = document.getElementById('canvas')
    let webgl = canvas.getContext('webgl2')

    webgl.viewport(0, 0, canvas.width, canvas.height)
	webgl.clearColor(.85, .9, .9, 1)
	webgl.enable(webgl.DEPTH_TEST)

	return webgl
}

function getShadowShader(webgl) {
	let shadowShader = initShaders(webgl, 'shaders/svshader.glsl', 'shaders/sfshader.glsl')
	webgl.useProgram(shadowShader)

	let frameBuffer = webgl.createFramebuffer()
	frameBuffer.width = 256
	frameBuffer.height = 256
	let renderBuffer = webgl.createRenderbuffer()

	webgl.bindFramebuffer(webgl.FRAMEBUFFER, frameBuffer)
	webgl.bindRenderbuffer(webgl.RENDERBUFFER, renderBuffer)

	webgl.renderbufferStorage(webgl.RENDERBUFFER, webgl.DEPTH_COMPONENT16, 256, 256)
	webgl.framebufferRenderbuffer(webgl.FRAMEBUFFER, webgl.DEPTH_ATTACHMENT, webgl.RENDERBUFFER, renderBuffer)
	let depthTexture = webgl.createTexture()
	webgl.bindTexture(webgl.TEXTURE_2D, depthTexture)
	webgl.texImage2D(webgl.TEXTURE_2D, 0, webgl.RGBA, 256, 256, 0, webgl.RGBA, webgl.UNSIGNED_BYTE, null)
	webgl.generateMipmap(webgl.TEXTURE_2D)
	webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.NEAREST_MIPMAP_NEAREST)
	webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MAG_FILTER, webgl.NEAREST)
//	webgl.texParameterf(webgl.TEXTURE_2D, webgl.TEXTURE_MAG_FILTER, webgl.NEAREST)
//	webgl.texParameterf(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.NEAREST)
//	webgl.texParameterf(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_S, webgl.CLAMP_TO_EDGE)
//	webgl.texParameterf(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_T, webgl.CLAMP_TO_EDGE)

	webgl.bindFramebuffer(webgl.FRAMEBUFFER, null)
	webgl.bindRenderbuffer(webgl.RENDERBUFFER, null)

	return [shadowShader, frameBuffer, renderBuffer, depthTexture]
}

function getPlayer() {
	let player = [new Player(
		ortho(-3, 7, -3, 7, -3, 7),
		vec3(playerPosition[0], playerPosition[1], playerPosition[2]),
		vec3(1, 0, 0),
		vec3(0, 0, -1),
		vec3(0, 1, 0)
	), new Player(
		perspective(90, 1, .1, 20),
		vec3(2 * Math.sin(radians(angle / 2)) + playerPosition[3], 2, 2 * Math.cos(radians(angle / 2)) + playerPosition[5]),
		vec3(Math.sin(radians(angle / 2 + 90)), 0, Math.cos(radians(angle / 2 + 90))),
		vec3(-Math.sin(radians(angle / 2)), 1, -Math.cos(radians(angle / 2))),
		vec3(Math.sin(radians(angle / 2)), 1, Math.cos(radians(angle / 2)))
	)]
	return player
}

function getLight() {
	return new Light(
		vec3(-5 * Math.cos(radians(angle)), -5 * Math.sin(radians(angle)), 0),
		vec4(.5, .5, .5, 1),
		vec4(.5, .5, .5, 1),
		vec4(1, 1, 1, 1),
		new Player(
			ortho(-10, 10, -10, 10, -10, 10),
			vec3(0, 0, 0),
			vec3(Math.cos(radians(angle - 90)), Math.sin(radians(angle - 90)), 0),
			vec3(0, 0, -1),
			vec3(Math.cos(radians(angle)), Math.sin(radians(angle)), 0)
		)
	)
}

let texture = {
	grass: null,
	slime: null,
	cape: null,
	diamond: null
}
function getTextures(webgl) {
	let grass = new Image()
	grass.src = 'textures/grass.png'
	grass.onload = function() {
		texture['grass'] = webgl.createTexture()
		webgl.bindTexture(webgl.TEXTURE_2D, texture['grass'])
		webgl.texImage2D(webgl.TEXTURE_2D, 0, webgl.RGB, grass.width, grass.height, 0, webgl.RGB, webgl.UNSIGNED_BYTE, grass)
		webgl.generateMipmap(webgl.TEXTURE_2D)
		webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.NEAREST_MIPMAP_NEAREST)
		webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MAG_FILTER, webgl.NEAREST)
	}
	let slime = new Image()
	slime.src = 'textures/slime.png'
	slime.onload = function() {
		texture['slime'] = webgl.createTexture()
		webgl.bindTexture(webgl.TEXTURE_2D, texture['slime'])
		webgl.texImage2D(webgl.TEXTURE_2D, 0, webgl.RGB, slime.width, slime.height, 0, webgl.RGB, webgl.UNSIGNED_BYTE, slime)
		webgl.generateMipmap(webgl.TEXTURE_2D)
		webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.NEAREST_MIPMAP_NEAREST)
		webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MAG_FILTER, webgl.NEAREST)
	}
	let cape = new Image()
	cape.src = 'textures/cape.png'
	cape.onload = function() {
		texture['cape'] = webgl.createTexture()
		webgl.bindTexture(webgl.TEXTURE_2D, texture['cape'])
		webgl.texImage2D(webgl.TEXTURE_2D, 0, webgl.RGB, cape.width, cape.height, 0, webgl.RGB, webgl.UNSIGNED_BYTE, cape)
		webgl.generateMipmap(webgl.TEXTURE_2D)
		webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.NEAREST_MIPMAP_NEAREST)
		webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MAG_FILTER, webgl.NEAREST)
	}
	let diamond = new Image()
	diamond.src = 'textures/diamond.png'
	diamond.onload = function() {
		texture['diamond'] = webgl.createTexture()
		webgl.bindTexture(webgl.TEXTURE_2D, texture['diamond'])
		webgl.texImage2D(webgl.TEXTURE_2D, 0, webgl.RGB, diamond.width, diamond.height, 0, webgl.RGB, webgl.UNSIGNED_BYTE, diamond)
		webgl.generateMipmap(webgl.TEXTURE_2D)
		webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.NEAREST_MIPMAP_NEAREST)
		webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MAG_FILTER, webgl.NEAREST)
	}
}

function getGrass() {
	let vertices = []
	let faces = []
	let normal = []
	let textureCoordinates = []

	for (let i = -10; i < 10; i += .5) {
		for (let j = -10; j < 10; j += .5) {
			vertices.push(vec3(i, 0, j), vec3(i + .5, 0, j), vec3(i, 0, j + .5), vec3(i + .5, 0, j + .5))
			faces.push(vertices.length - 4, vertices.length - 3, vertices.length - 2, vertices.length - 3, vertices.length - 2, vertices.length - 1)
			normal.push(vec3(0, 1, 0), vec3(0, 1, 0), vec3(0, 1, 0), vec3(0, 1, 0))
			textureCoordinates.push(vec2(0, 0), vec2(1, 0), vec2(0, 1), vec2(1, 1))
		}
	}

	return new Polygon(vertices, faces, normal, textureCoordinates)
}

function getSlime() {
	let slime = new Polygon([
    	vec3(0, 0, 0),
    	vec3(slimeSize, 0, 0),
    	vec3(slimeSize, 0, slimeSize),
    	vec3(0, 0, slimeSize),
    	vec3(0, slimeSize, 0),
    	vec3(slimeSize, slimeSize, 0),
    	vec3(slimeSize, slimeSize, slimeSize),
    	vec3(0, slimeSize, slimeSize)
	], [
		0, 3, 2,
		0, 2, 1,
		2, 3, 7,
		2, 7, 6,
		0, 4, 7,
		0, 7, 3,
		1, 2, 6,
		1, 6, 5,
		4, 5, 6,
		4, 6, 7,
		0, 1, 5,
		0, 5, 4
	], [
    	normalize(vec3(-1, -1, -1)),
    	normalize(vec3(1, -1, -1)),
    	normalize(vec3(1, -1, 1)),
    	normalize(vec3(-1, -1, 1)),
    	normalize(vec3(-1, 1, -1)),
    	normalize(vec3(1, 1, -1)),
    	normalize(vec3(1, 1, 1)),
    	normalize(vec3(-1, 1, 1))
	], [
		vec2(0, 0),
		vec2(1, 0),
		vec2(1, 1),
		vec2(0, 1),
		vec2(0, 0),
		vec2(1, 0),
		vec2(1, 1),
		vec2(0, 1)
	])
	slime.setTransformation([
		playerPosition[3], playerPosition[4], playerPosition[5],
		1, 1, 1,
		0, 0, 0,
		0, 0, 0
	])
	return slime
}

function getSlimeCape() {
	let capeHeight = [.3, .35, .4]
	let slimeCape = new Polygon([
    	vec3(0, capeHeight[Math.floor(Math.random() * capeHeight.length)], 0),
    	vec3(slimeSize, capeHeight[Math.floor(Math.random() * capeHeight.length)], 0),
    	vec3(slimeSize, capeHeight[Math.floor(Math.random() * capeHeight.length)], slimeSize),
    	vec3(0, capeHeight[Math.floor(Math.random() * capeHeight.length)], slimeSize)
	], [
		0, 1, 2,
		2, 3, 0
	], [
    	normalize(vec3(0, 1, 0)),
    	normalize(vec3(0, 1, 0)),
    	normalize(vec3(0, 1, 0)),
    	normalize(vec3(0, 1, 0))
	], [
		vec2(0, 0),
		vec2(1, 0),
		vec2(1, 1),
		vec2(0, 1)
	])
	slimeCape.setTransformation([
		playerPosition[6], playerPosition[7], playerPosition[8],
		1, 1, 1,
		0, 0, 0,
		0, 0, 0
	])
	return slimeCape
}

function getDiamonds() {
	let diamonds = []

	for (let i = 0; i < diamondXs.length; i++) {
		let diamondX = diamondXs[i]
		let diamondZ = diamondZs[i]
		let diamondSize = .5
		let diamond = new Polygon([
			vec3(diamondX, 0, diamondZ),
			vec3(diamondSize / 2 + diamondX, diamondSize, diamondZ),
			vec3(diamondX, diamondSize, diamondSize / 2 + diamondZ),
			vec3(-diamondSize / 2 + diamondX, diamondSize, diamondZ),
			vec3(diamondX, diamondSize, -diamondSize / 2 + diamondZ),
			vec3(diamondX, diamondSize * 2, diamondZ)
		], [
			0, 1, 2,
			0, 2, 3,
			0, 3, 4,
			0, 4, 1,
			5, 1, 2,
			5, 2, 3,
			5, 3, 4,
			5, 4, 1,
		], [
			normalize(vec3(0, -1, 0)),
			normalize(vec3(0, 0, -1)),
			normalize(vec3(1, 0, 0)),
			normalize(vec3(0, 0, 1)),
			normalize(vec3(-1, 0, 0)),
			normalize(vec3(0, 1, 0))
		], [
			vec2(0, 0),
			vec2(1, 0),
			vec2(0, 1),
			vec2(1, 0),
			vec2(0, 1),
			vec2(1, 1)
		])
		diamond.setTransformation([
			0, 0, 0,
			1, 1, 1,
			0, -angle, 0,
			diamondX, 0, diamondZ
		])
		diamonds.push(diamond)
	}

	return diamonds
}

window.onload = function render() {
	let webgl = getWebgl()
	let shader = initShaders(webgl, 'shaders/vshader.glsl', 'shaders/fshader.glsl')
	getTextures(webgl)
	let grass = getGrass()

	setInterval(() => {
		for (const [key, value] of Object.entries(texture)) {
			if (value == null) {
				return
			}
		}

		let shadowShader = getShadowShader(webgl)
		player = getPlayer()
		let light = getLight()
		let slime = getSlime()
		let slimeCape = getSlimeCape()
		let diamonds = getDiamonds()
		drawShadows(webgl, shadowShader, light, [slime, slimeCape].concat(diamonds))
		drawObjects(webgl, shader, player, light, shadowShader[3], [grass, slime, slimeCape].concat(diamonds))

		angle += 3
		if (diamondXs.length == 6) {
			slimeSize = 1
		} else if (diamondXs.length == 3) {
			slimeSize = 1.5
		} else if (diamondXs.length == 0) {
			playerPosition[6] = playerPosition[3]
			playerPosition[7] = playerPosition[4]
			playerPosition[8] = playerPosition[5]
			slimeSize = .5
			for (let i = 0; i < 10; i++) {
				diamondXs.push(Math.random() * 20 - 10)
				diamondZs.push(Math.random() * 20 - 10)
			}
		}
	}, 50)
}

function drawShadows(webgl, shadowShader, light, objects) { drawShadowsHelper(webgl, shadowShader[0], shadowShader[1], shadowShader[2], shadowShader[3], light, objects) }
function drawShadowsHelper(webgl, shadowShader, frameBuffer, renderBuffer, depthTexture, light, objects) {
	webgl.bindFramebuffer(webgl.FRAMEBUFFER, frameBuffer)
	webgl.bindRenderbuffer(webgl.RENDERBUFFER, renderBuffer)

	webgl.activeTexture(webgl.TEXTURE0)
	webgl.bindTexture(webgl.TEXTURE_2D, depthTexture)
	webgl.framebufferTexture2D(webgl.FRAMEBUFFER, webgl.COLOR_ATTACHMENT0, webgl.TEXTURE_2D, depthTexture, 0)

	webgl.clear(webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT)
	for (let i = 0; i < objects.length; i++) {
		objects[i].drawShadow(webgl, shadowShader, light)
	}

	webgl.bindFramebuffer(webgl.FRAMEBUFFER, null)
	webgl.bindRenderbuffer(webgl.RENDERBUFFER, null)
}

function drawObjects(webgl, shader, player, light, depthTexture, objects) {
	webgl.clear(webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT)
	objects[0].draw(webgl, shader, player[currentPlayer], light, texture['grass'], depthTexture)
	objects[1].draw(webgl, shader, player[currentPlayer], light, texture['slime'], depthTexture)
	objects[2].draw(webgl, shader, player[currentPlayer], light, texture['cape'], depthTexture)
	for (let i = 3; i < objects.length; i++) {
		objects[i].draw(webgl, shader, player[currentPlayer], light, texture['diamond'], depthTexture)
	}
}

let angle = 0
let player
let playerPosition = [-1.5, 5, 2, 0, 0, 0, 0, 0, 0]
let currentPlayer = 0

let diamondXs = []
let diamondZs = []
let slimeSize = .5
document.onkeydown = function controlPlayer(windowEvent) {
	let isDown = windowEvent.keyCode == '38' && playerPosition[5] - slimeSize >= -10
	let isUp = windowEvent.keyCode == '40' && playerPosition[5] + slimeSize * 2 <= 10
	let isLeft = windowEvent.keyCode == '37' && playerPosition[3] - slimeSize >= -10
	let isRight = windowEvent.keyCode == '39' && playerPosition[3] + slimeSize * 2 <= 10
	let isSpace = windowEvent.keyCode == '32'

	if (isDown || isUp || isLeft || isRight) {
		playerPosition[6] = playerPosition[3]
		playerPosition[7] = playerPosition[4]
		playerPosition[8] = playerPosition[5]
	} if (isDown) {
		playerPosition[2] -= slimeSize
		playerPosition[5] -= slimeSize
    } else if (isUp) {
		playerPosition[2] += slimeSize
		playerPosition[5] += slimeSize
    } else if (isLeft) {
		playerPosition[0] -= slimeSize
		playerPosition[3] -= slimeSize
    } else if (isRight) {
		playerPosition[0] += slimeSize
		playerPosition[3] += slimeSize
    } else if (isSpace) {
		currentPlayer = 1 - currentPlayer
	}
}

document.onclick = function pick(windowEvent) {
	let cameraX = 2 * windowEvent.clientX / document.getElementById('canvas').width - 1
	let cameraY = 1 - 2 * windowEvent.clientY / document.getElementById('canvas').height

	let inverseProjection = mult(inverse(player[currentPlayer].getProjection()), vec4(cameraX, cameraY, -1, 1))
	inverseProjection[0] /= inverseProjection[3]
	inverseProjection[1] /= inverseProjection[3]
	inverseProjection[2] /= inverseProjection[3]
	inverseProjection[3] /= inverseProjection[3]
	let inverseCamera = mult(inverse(player[currentPlayer].getCamera()), inverseProjection)
	inverseCamera[0] /= inverseCamera[3]
	inverseCamera[2] /= inverseCamera[3]

	for (let i = 0; i < diamondXs.length; i++) {
		if (Math.abs(diamondXs[i] - inverseCamera[0]) < .25 && Math.abs(diamondZs[i] - inverseCamera[2]) < .25) {
			diamondXs.splice(i, 1)
			diamondZs.splice(i, 1)
			break
		}
	}
}
