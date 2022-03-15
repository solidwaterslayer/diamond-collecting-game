#version 300 es

uniform mat4 shadow;
uniform mat4 projection;
uniform mat4 camera;
uniform mat4 transformation;
in vec3 position;

uniform vec3 lightDirection;
uniform vec4 lightAmbient, lightDiffuse, lightSpecular;
uniform vec4 objectAmbient, objectDiffuse, objectSpecular;
uniform float objectAlpha;
in vec3 normal;
out vec4 light;

in vec2 vTextureCoordinate;
out vec2 textureCoordinate;
out vec4 vShadowPosition;
out float depth;

void main() {
    gl_Position = projection * camera * transformation * vec4(position, 1);

	vec3 e = normalize(-(camera * transformation * vec4(position, 1)).xyz);
    vec3 l = normalize((-camera * vec4(lightDirection, 0)).xyz);
    vec3 n = normalize(camera * transformation * vec4(normal, 0)).xyz;
    vec3 h = normalize(e + l);
    vec4 ambient = lightAmbient * objectAmbient;

    float kd = max(dot(l, n), 0.);
    vec4 diffuse = kd * lightDiffuse * objectDiffuse;
    float ks = pow(max(dot(n, h), 0.), objectAlpha);
    vec4 specular = ks * lightSpecular * objectSpecular;

    light = ambient + diffuse + specular;
    light.a = 1.;

	textureCoordinate = vTextureCoordinate;
	vShadowPosition = projection * shadow * transformation * vec4(position, 1.);
	depth = -(shadow * transformation * vec4(position, 1)).z;
}
