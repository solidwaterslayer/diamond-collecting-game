#version 300 es
precision mediump float;

uniform sampler2D objectTexture;
in vec4 light;
in vec2 textureCoordinate;
out vec4 color;

void main() {
	color = light * texture(objectTexture, textureCoordinate);
}
