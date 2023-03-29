import { Log } from "../log";

export class GlLog {
	public static CheckVertexArrayCreation(vao: WebGLVertexArrayObject): void {
		if (!vao)
			Log.Panic("GLLog", "Cannot create vertex array object (gl.createVertexArray()).");
	}

	public static CheckBufferCreation(buffer: WebGLBuffer): void {
		if (!buffer)
			Log.Panic("GLLog", "Cannot create buffer (gl.createBuffer()).");
	}

	public static CheckProgramCreation(program: WebGLProgram): void {
		if (!program)
			Log.Panic("GLLog", "Cannot create program (gl.createProgram()).");
	}

	public static CheckShaderCreation(shader: WebGLShader): void {
		if (!shader)
			Log.Panic("GLLog", "Cannot create shader (gl.createShader(...)).");
	}

	public static CheckShaderCompileStatus(gl: WebGL2RenderingContext, shader: WebGLShader): void {
		const isCompileSuccess = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

		if (isCompileSuccess) return;

		const messageLog = gl.getShaderInfoLog(shader) || "";

		Log.Panic("GlLog", `Shader compile error: ${messageLog}`);
	}

	public static CheckProgramLinkStatus(gl: WebGL2RenderingContext, program: WebGLProgram): void {
		const isLinkProgramSuccessful = gl.getProgramParameter(program, gl.LINK_STATUS);

		if (isLinkProgramSuccessful) return;

		const messageLog = gl.getProgramInfoLog(program) || "";

		Log.Panic("GlLog", `Program link error: ${messageLog}`);
	}
}
