#version 300 es
precision mediump float;

uniform sampler2D objectTexture;
uniform sampler2D depthTexture;
in vec4 light;
in vec2 textureCoordinate;
in vec4 vShadowPosition;
in float depth;
out vec4 color;

void main() {
	color = light * texture(objectTexture, textureCoordinate);

	vec3 shadowPosition = vShadowPosition.xyz / vShadowPosition.w;
	shadowPosition = .5 * shadowPosition + .5;
	float distance = texture(depthTexture, shadowPosition.xy).r;
	float bestDistance = depth / 20.;

	if (distance < bestDistance - .1) {
		color.rgb *= .5;
	}
	color.a = 1.;
}
