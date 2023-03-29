#version 300 es

precision highp float;
uniform vec4 shapeColor;
out vec4 fragColor;

void main() { fragColor = shapeColor; }
