#version 300 es

uniform mat4 projection;
uniform mat4 camera;
uniform mat4 transformation;
in vec3 position;
out float depth;

void main() {
    gl_Position = projection * camera * transformation * vec4(position, 1);
	depth = -(camera * transformation * vec4(position, 1)).z;
}
