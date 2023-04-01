#version 300 es

precision highp float;
layout(location = 0) in vec3 a_pos;
uniform mat4 projection;
uniform vec2 viewportSize;

mat4 NDC(mat4 self)
{
    mat4 ndcMatrix = mat4(
        viewportSize.x * 0.5, 0, 0, 0,
        0, viewportSize.y * 0.5, 0, 0,
        0, 0, 1, 0,
        viewportSize.x * 0.5, viewportSize.y * 0.5, 0, 1
    );

    return self * ndcMatrix;
}

void main() {
    gl_Position = NDC(projection) * vec4(a_pos, 1.0);
}
