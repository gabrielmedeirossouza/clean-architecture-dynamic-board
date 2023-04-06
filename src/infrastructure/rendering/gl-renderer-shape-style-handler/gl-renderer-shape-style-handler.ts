import { Actor } from "@/domain/entities";
import { GlRendererHandlerProtocol, GlRendererProtocol } from "@/domain/protocols";
import { ShapeStyle } from "@/infrastructure";
import { GlLog } from "@/helpers/gl";
import vertexShaderSource from '@/shaders/shape-style-vertex-shader.glsl?raw';
import fragmentShaderSource from '@/shaders/shape-style-fragment-shader.glsl?raw';

type CacheMap = {
    vbo: WebGLBuffer;
    vao: WebGLVertexArrayObject;
    color: [r: number, g: number, b: number, a: number];
    colorUL: WebGLUniformLocation;
    invWidth: number;
    invHeight: number;
}

interface ActorWithShapeStyle extends Actor {
    style: ShapeStyle;
}

export class GlRendererShapeStyleHandler extends GlRendererHandlerProtocol
{
	private _loaded = false;

	private _cacheMap = new Map<string, CacheMap>();

	private _program: WebGLProgram = {};

	private _projectionULocation: WebGLUniformLocation = {};

	private _viewportSizeULocation: WebGLUniformLocation = {};

	constructor(
		next?: GlRendererHandlerProtocol
	)
	{
		super(next);
	}

	public Handle(renderer: GlRendererProtocol, actor: ActorWithShapeStyle): void
	{
		if (!(actor.style instanceof ShapeStyle)) return this._Next(renderer, actor);

		if (!this._loaded)
		{
			this._Prepare(renderer);
			this._loaded = true;
		}

		const cache = this._cacheMap.get(actor.uuid);
		if (!cache)
		{
			this._CreateCache(renderer, actor);
			this._Render(renderer, actor);

			return;
		}

		this._Render(renderer, actor as ActorWithShapeStyle);
	}

	private _Prepare(renderer: GlRendererProtocol): void
	{
		const vertexShader = renderer.gl.createShader(renderer.gl.VERTEX_SHADER)!;
		GlLog.CheckShaderCreation(vertexShader);
		renderer.gl.shaderSource(vertexShader, vertexShaderSource);
		renderer.gl.compileShader(vertexShader);
		GlLog.CheckShaderCompileStatus(renderer.gl, vertexShader);

		const fragmentShader = renderer.gl.createShader(renderer.gl.FRAGMENT_SHADER)!;
		GlLog.CheckShaderCreation(fragmentShader);
		renderer.gl.shaderSource(fragmentShader, fragmentShaderSource);
		renderer.gl.compileShader(fragmentShader);
		GlLog.CheckShaderCompileStatus(renderer.gl, fragmentShader);

		this._program = renderer.gl.createProgram()!;
		GlLog.CheckProgramCreation(this._program);
		renderer.gl.attachShader(this._program, vertexShader);
		renderer.gl.attachShader(this._program, fragmentShader);
		renderer.gl.linkProgram(this._program);
		GlLog.CheckProgramLinkStatus(renderer.gl, this._program);
		renderer.gl.deleteShader(vertexShader);
		renderer.gl.deleteShader(fragmentShader);

		renderer.gl.useProgram(this._program);
		this._projectionULocation = renderer.gl.getUniformLocation(this._program, "projection")!;
		this._viewportSizeULocation = renderer.gl.getUniformLocation(this._program, "viewportSize")!;

		renderer.observable.Subscribe("on-unload-actors", (actors) =>
		{
			actors.forEach(actor =>
			{
				this._cacheMap.delete(actor.uuid);
			});
		});
	}

	private _Render(renderer: GlRendererProtocol, actor: ActorWithShapeStyle): void
	{
		const { width, height } = renderer.canvas;
		const normalizedProjection = renderer.camera.projection;
		renderer.gl.uniformMatrix4fv(this._projectionULocation, true, new Float32Array(normalizedProjection.data));
		renderer.gl.uniform2f(this._viewportSizeULocation, width, height);

		const cache = this._cacheMap.get(actor.uuid)!;

		const { x, y } = actor.transform.position.world;
		const halfWidth = actor.style.width.value * 0.5;
		const halfHeight = actor.style.height.value * 0.5;

		const xl = (x - halfWidth) * cache.invWidth;
		const xr = (x + halfWidth) * cache.invWidth;
		const yt = (y + halfHeight) * cache.invHeight;
		const yb = (y - halfHeight) * cache.invHeight;

		const vertices = new Float32Array([
			xl, yt, 0,
			xr, yt, 0,
			xr, yb, 0,
			xl, yb, 0,
		]);

		renderer.gl.bufferData(renderer.gl.ARRAY_BUFFER, vertices, renderer.gl.DYNAMIC_DRAW, 0);
		renderer.gl.uniform4f(cache.colorUL, cache.color[0], cache.color[1], cache.color[2], cache.color[3]);
		renderer.gl.drawElements(renderer.gl.TRIANGLES, 6, renderer.gl.UNSIGNED_SHORT, 0);
	}

	private _CreateCache(renderer: GlRendererProtocol, actor: ActorWithShapeStyle): void
	{
		const vbo = renderer.gl.createBuffer()!;
		GlLog.CheckBufferCreation(vbo);
		renderer.gl.bindBuffer(renderer.gl.ARRAY_BUFFER, vbo);

		const vao = renderer.gl.createVertexArray()!;
		GlLog.CheckVertexArrayCreation(vao);
		renderer.gl.bindVertexArray(vao);
		renderer.gl.vertexAttribPointer(0, 3, renderer.gl.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
		renderer.gl.enableVertexAttribArray(0);

		const ebo = renderer.gl.createBuffer()!;
		GlLog.CheckBufferCreation(ebo);
		renderer.gl.bindBuffer(renderer.gl.ELEMENT_ARRAY_BUFFER, ebo);

		const indices = new Uint16Array([
			0, 1, 2,
			0, 2, 3
		]);

		renderer.gl.bufferData(renderer.gl.ELEMENT_ARRAY_BUFFER, indices, renderer.gl.DYNAMIC_DRAW);

		const colorUL = renderer.gl.getUniformLocation(this._program, "shapeColor")!;
		const [r, g, b, a] = actor.style.color.value.map(fragmentColor => fragmentColor / 255);

		this._cacheMap.set(actor.uuid, {
			vbo,
			vao,
			colorUL,
			color: [r, g, b, a],
			invWidth: 1 / renderer.canvas.width * 2,
			invHeight: 1 / renderer.canvas.height * 2,
		});
	}
}
