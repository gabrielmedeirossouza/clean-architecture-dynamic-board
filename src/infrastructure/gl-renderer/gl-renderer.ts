import { CameraProtocol, RendererProtocol } from "@/domain/protocols";
import { GlLog } from '@/helpers/gl';
import { GlStyle } from "../gl-style";
import { Matrix4 } from "@/core/math";
import { Element } from '@/domain/entities';
import vertexShaderSource from '@/shaders/shape-vertex-shader.glsl?raw';
import fragmentShaderSource from '@/shaders/shape-fragment-shader.glsl?raw';

interface ElementWithStyle extends Element {
    style: GlStyle;
}

export class GlRenderer extends RendererProtocol {
	private readonly _gl: WebGL2RenderingContext;

	private _canvas: HTMLCanvasElement;

	private _program: WebGLProgram = {};

	private _projectionULocation: WebGLUniformLocation = {};

	constructor(
		parent: HTMLElement,
		camera: CameraProtocol,
        public readonly width: number,
        public readonly height: number
	) {
		super(camera);

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
		this._gl.viewport(0, 0, this.width, this.height);

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

		this._program = this._gl.createProgram()!;
		GlLog.CheckProgramCreation(this._program);
		this._gl.attachShader(this._program, vertexShader);
		this._gl.attachShader(this._program, fragmentShader);
		this._gl.linkProgram(this._program);
		GlLog.CheckProgramLinkStatus(this._gl, this._program);
		this._gl.deleteShader(vertexShader);
		this._gl.deleteShader(fragmentShader);

		this._gl.useProgram(this._program);
		this._projectionULocation = this._gl.getUniformLocation(this._program, "projection")!;
		this._gl.clearColor(0.2, 0.23, 0.34, 1);
	}

	protected _Render(): void {
		this._gl.clear(this._gl.COLOR_BUFFER_BIT);

		const normalizedProjection = Matrix4.NDC(this.camera.projection, this.width, this.height);
		this._gl.uniformMatrix4fv(this._projectionULocation, true, new Float32Array(normalizedProjection.data));

		this._elements.forEach(element => {
			if (!element.style) return;

			if (element.style instanceof GlStyle) {
				this._RenderElementShapeStyle(element as ElementWithStyle);
			}

			this._gl.drawArrays(this._gl.TRIANGLES, 0, 6);
		});
	}

	private _RenderElementShapeStyle(element: ElementWithStyle): void {
		const { x, y } = element.transform.position;
		const halfWidth = element.style.data.width.value / 2;
		const halfHeight = element.style.data.height.value / 2;

		const xl = (x - halfWidth) / this.width;
		const xr = (x + halfWidth) / this.width;
		const yt = (y + halfHeight) / this.height;
		const yb = (y - halfHeight) / this.height;

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

		const [r, g, b, a] = element.style.data.color.value.map(fragmentColor => fragmentColor / 255);
		const shapeColorUniformLocation = this._gl.getUniformLocation(this._program, "shapeColor");
		this._gl.uniform4f(shapeColorUniformLocation, r, g, b, a);
	}
}
