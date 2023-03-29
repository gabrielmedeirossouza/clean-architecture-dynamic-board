import { RendererProtocol } from "@/domain/protocols";
import { GlLog } from '@/helpers/gl';
import vertexShaderSource from '@/shaders/shape-vertex-shader.glsl?raw';
import fragmentShaderSource from '@/shaders/shape-fragment-shader.glsl?raw';
import { GlStyle } from "../gl-style";

export class GlRenderer extends RendererProtocol {
	private readonly _gl: WebGL2RenderingContext;

	private _canvas: HTMLCanvasElement;

	private _program: WebGLProgram = {};

	constructor(
		parent: HTMLElement,
        public readonly width: number,
        public readonly height: number
	) {
		super();

		const canvas = document.createElement('canvas');
		this._canvas = canvas;
		this._canvas.width = width;
		this._canvas.height = height;

		parent.append(canvas);

		const expectContext = canvas.getContext("webgl2");
		if (!expectContext) throw new Error(`Fail to attempt get Webgl2 context`);

		this._gl = expectContext;
		this._InitializeGl();
	}

	private _InitializeGl(): void {
		const vertexShader = this._gl.createShader(this._gl.VERTEX_SHADER)!;
		GlLog.CheckShaderCreation(vertexShader);
		this._gl.shaderSource(vertexShader, vertexShaderSource);
		this._gl.compileShader(vertexShader);
		GlLog.CheckShaderCompileStatus(this._gl, vertexShader);

		const fragmentShader = this._gl.createShader(this._gl.FRAGMENT_SHADER)!;
		GlLog.CheckShaderCreation(fragmentShader);
		this._gl.shaderSource(fragmentShader, fragmentShaderSource);
		this._gl.compileShader(fragmentShader);
		GlLog.CheckShaderCompileStatus(this._gl, fragmentShader);

		const program = this._gl.createProgram()!;
		GlLog.CheckProgramCreation(program);
		this._gl.attachShader(program, vertexShader);
		this._gl.attachShader(program, fragmentShader);
		this._gl.linkProgram(program);
		GlLog.CheckProgramLinkStatus(this._gl, program);

		this._gl.useProgram(program);
		this._gl.clearColor(0.2, 0.23, 0.34, 1);

		this._program = program;
	}

	protected _Render(): void {
		this._gl.clear(this._gl.COLOR_BUFFER_BIT);

		this._elements.forEach(element => {
			if (!element.style || !(element.style instanceof GlStyle)) return;

			this._CreateElementStyle(element.style);
		});

		this._gl.drawArrays(this._gl.TRIANGLES, 0, 6);
	}

	private _CreateElementStyle(style: GlStyle): void {
		const xl = -((style.data.width.value / 2) / this.width);
		const xr = (style.data.width.value / 2) / this.width;
		const yt = (style.data.height.value / 2) / this.height;
		const yb = -((style.data.height.value / 2) / this.height);

		const vertices = new Float32Array([
			xl, yt, 0,
			xr, yt, 0,
			xr, yb, 0,

			xl, yt, 0,
			xl, yb, 0,
			xr, yb, 0
		]);

		const vbo = this._gl.createBuffer()!;
		GlLog.CheckBufferCreation(vbo);
		this._gl.bindBuffer(this._gl.ARRAY_BUFFER, vbo);
		this._gl.bufferData(this._gl.ARRAY_BUFFER, vertices, this._gl.STATIC_DRAW, 0);

		const vao = this._gl.createVertexArray()!;
		GlLog.CheckVertexArrayCreation(vao);
		this._gl.bindVertexArray(vao);
		this._gl.vertexAttribPointer(0, 3, this._gl.FLOAT, false, 3 * vertices.BYTES_PER_ELEMENT, 0);
		this._gl.enableVertexAttribArray(0);

		const [r, g, b, a] = style.data.color.value.map(fragmentColor => fragmentColor / 255);
		const shapeColorUniformLocation = this._gl.getUniformLocation(this._program, "shapeColor");
		this._gl.uniform4f(shapeColorUniformLocation, r, g, b, a);
	}
}
