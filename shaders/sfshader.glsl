#version 300 es
precision mediump float;

in float depth;
out vec4 color;

void main() { color = vec4(depth / 20., depth / 20., depth / 20., 1); }
