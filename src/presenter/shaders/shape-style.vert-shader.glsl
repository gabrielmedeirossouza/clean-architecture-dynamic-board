#version 300 es

precision highp float;
layout(location = 0) in vec3 a_pos;
uniform mat4 projection;
uniform vec2 viewportSize;

mat4 screenSpace(mat4 self)
{
    mat4 screenSpaceScalar = mat4(
        viewportSize.x * 0.5, 0, 0, 0,
        0, viewportSize.y * 0.5, 0, 0,
        0, 0, 1, 0,
        viewportSize.x * 0.5, viewportSize.y * 0.5, 0, 1
    );

    return self * screenSpaceScalar;
}

vec4 NDC_VEC4(vec4 self)
{
    vec4 ndcVector = vec4(
        self.x / viewportSize.x * 2.0 - 1.0,
        self.y / viewportSize.y * 2.0 - 1.0,
        self.z,
        self.w
    );

    return ndcVector;
}

void main() {
    gl_Position = screenSpace(projection) * NDC_VEC4(vec4(a_pos, 1.0));
}
