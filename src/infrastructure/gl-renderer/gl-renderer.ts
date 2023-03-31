import { CameraProtocol, RendererProtocol, RendererObserverMap } from "@/domain/protocols";
import { GlLog } from '@/helpers/gl';
import { GlStyle } from "../gl-style";
import { Matrix4 } from "@/core/math";
import { Element } from '@/domain/entities';
import vertexShaderSource from '@/shaders/shape-vertex-shader.glsl?raw';
import fragmentShaderSource from '@/shaders/shape-fragment-shader.glsl?raw';
import { ObserverFactory } from "@/factories";

type CacheShaderMap = {
    vbo: WebGLBuffer;
    vao: WebGLVertexArrayObject;
    color: [r: number, g: number, b: number, a: number];
    colorUL: WebGLUniformLocation;
}

interface ElementWithStyle extends Element {
    style: GlStyle;
}

export class GlRenderer extends RendererProtocol {
	private readonly _gl: WebGL2RenderingContext;

	private _canvas: HTMLCanvasElement;

	private _program: WebGLProgram = {};

	private _projectionULocation: WebGLUniformLocation = {};

	private _cacheShaderMap = new Map<string, CacheShaderMap>();

	private _invWidth = 0;

	private _invHeight = 0;

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

		this._invWidth = 1 / width;
		this._invHeight = 1 / height;

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

		this.observable.Subscribe(new ObserverFactory<RendererObserverMap>().CreateObserver("on-load-element", (element) => {
			if (!element.style) return;

			if (element.style instanceof GlStyle) {
				this._CreateCacheShader(element as ElementWithStyle);
			}
		}));

		this.observable.Subscribe(new ObserverFactory<RendererObserverMap>().CreateObserver("on-unload-element", (element) => {
			this._cacheShaderMap.delete(element.uuid);
		}));
	}

	protected _BeforeRender(): void {
		this._gl.clear(this._gl.COLOR_BUFFER_BIT);

		const normalizedProjection = Matrix4.NDC(this.camera.projection, this.width, this.height);
		this._gl.uniformMatrix4fv(this._projectionULocation, true, new Float32Array(normalizedProjection.data));
	}

	protected _Render(): void {
		this._elements.forEach(element => {
			if (!element.style) return;

			if (element.style instanceof GlStyle) {
				this._RenderElementShapeStyle(element as ElementWithStyle);
			}

			this._gl.drawElements(this._gl.TRIANGLES, 6, this._gl.UNSIGNED_SHORT, 0);
		});
	}

	private _RenderElementShapeStyle(element: ElementWithStyle): void {
		const { x, y } = element.transform.position;
		const halfWidth = element.style.data.width.value * 0.5;
		const halfHeight = element.style.data.height.value * 0.5;

		const xl = (x - halfWidth) * this._invWidth;
		const xr = (x + halfWidth) * this._invWidth;
		const yt = (y + halfHeight) * this._invHeight;
		const yb = (y - halfHeight) * this._invHeight;

		const vertices = new Float32Array([
			xl, yt, 0,
			xr, yt, 0,
			xr, yb, 0,
			xl, yb, 0,
		]);

		const cache = this._cacheShaderMap.get(element.uuid)!;
		this._gl.bufferData(this._gl.ARRAY_BUFFER, vertices, this._gl.DYNAMIC_DRAW, 0);
		this._gl.uniform4f(cache.colorUL, cache.color[0], cache.color[1], cache.color[2], cache.color[3]);
	}

	private _CreateCacheShader(element: ElementWithStyle): void {
		const vbo = this._gl.createBuffer()!;
		GlLog.CheckBufferCreation(vbo);
		this._gl.bindBuffer(this._gl.ARRAY_BUFFER, vbo);

		const vao = this._gl.createVertexArray()!;
		GlLog.CheckVertexArrayCreation(vao);
		this._gl.bindVertexArray(vao);
		this._gl.vertexAttribPointer(0, 3, this._gl.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
		this._gl.enableVertexAttribArray(0);

		const ebo = this._gl.createBuffer()!;
		GlLog.CheckBufferCreation(ebo);
		this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, ebo);

		const indices = new Uint16Array([
			0, 1, 2,
			0, 2, 3
		]);

		this._gl.bufferData(this._gl.ELEMENT_ARRAY_BUFFER, indices, this._gl.DYNAMIC_DRAW);

		const colorUL = this._gl.getUniformLocation(this._program, "shapeColor")!;
		const [r, g, b, a] = element.style.data.color.value.map(fragmentColor => fragmentColor / 255);

		this._cacheShaderMap.set(element.uuid, {
			vbo,
			vao,
			colorUL,
			color: [r, g, b, a]
		});
	}
}
