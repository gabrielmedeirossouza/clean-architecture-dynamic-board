import { GlLog } from "@/core";
import { Actor, GlRendererHandlerProtocol, GlRendererProtocol } from "@/domain";
import { ShapeStyle } from "@/infrastructure";
import { shapeStyleVertShader, shapeStyleFragShader } from '@/presenter';

type CacheMap = {
    vbo: WebGLBuffer;
    vao: WebGLVertexArrayObject;
    color: [r: number, g: number, b: number, a: number];
    colorUL: WebGLUniformLocation;
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

	public Handle(renderer: GlRendererProtocol<WebGL2RenderingContext>, actor: ActorWithShapeStyle): void
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

	private _Prepare(renderer: GlRendererProtocol<WebGL2RenderingContext>): void
	{
		const vertexShader = renderer.gl.createShader(renderer.gl.VERTEX_SHADER)!;
		GlLog.CheckShaderCreation(vertexShader);
		renderer.gl.shaderSource(vertexShader, shapeStyleVertShader);
		renderer.gl.compileShader(vertexShader);
		GlLog.CheckShaderCompileStatus(renderer.gl, vertexShader);

		const fragmentShader = renderer.gl.createShader(renderer.gl.FRAGMENT_SHADER)!;
		GlLog.CheckShaderCreation(fragmentShader);
		renderer.gl.shaderSource(fragmentShader, shapeStyleFragShader);
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

	private _Render(renderer: GlRendererProtocol<WebGL2RenderingContext>, actor: ActorWithShapeStyle): void
	{
		const { gl, camera, width, height } = renderer;

		const normalizedProjection = camera.projection; // TODO: Render camera projection just when it changes
		gl.uniformMatrix4fv(this._projectionULocation, true, new Float32Array(normalizedProjection.data));
		gl.uniform2f(this._viewportSizeULocation, width, height);

		const cache = this._cacheMap.get(actor.uuid)!;

		const { x, y } = actor.transform.position.world;
		const scalarPivotWidth = actor.style.width.value * actor.style.pivot.x;
		const scalarPivotHeight = actor.style.height.value * actor.style.pivot.y;

		const xl = (x - scalarPivotWidth);
		const xr = (x + scalarPivotWidth);
		const yt = (y + scalarPivotHeight);
		const yb = (y - scalarPivotHeight);

		const vertices = new Float32Array([
			xl, yt, 0,
			xr, yt, 0,
			xr, yb, 0,
			xl, yb, 0,
		]);

		gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW, 0);
		gl.uniform4f(cache.colorUL, cache.color[0], cache.color[1], cache.color[2], cache.color[3]);
		gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
	}

	private _CreateCache(renderer: GlRendererProtocol<WebGL2RenderingContext>, actor: ActorWithShapeStyle): void
	{
		const { gl } = renderer;

		const vbo = gl.createBuffer()!;
		GlLog.CheckBufferCreation(vbo);
		gl.bindBuffer(gl.ARRAY_BUFFER, vbo);

		const vao = gl.createVertexArray()!;
		GlLog.CheckVertexArrayCreation(vao);
		gl.bindVertexArray(vao);
		gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
		gl.enableVertexAttribArray(0);

		const ebo = gl.createBuffer()!;
		GlLog.CheckBufferCreation(ebo);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebo);

		const indices = new Uint16Array([
			0, 1, 2,
			0, 2, 3
		]);

		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.DYNAMIC_DRAW);

		const colorUL = gl.getUniformLocation(this._program, "shapeColor")!;
		const [r, g, b, a] = actor.style.color.value.map(fragmentColor => fragmentColor / 255);

		this._cacheMap.set(actor.uuid, {
			vbo,
			vao,
			colorUL,
			color: [r, g, b, a],
		});
	}
}
