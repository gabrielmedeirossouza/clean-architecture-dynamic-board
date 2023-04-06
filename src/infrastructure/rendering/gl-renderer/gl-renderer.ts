import { CameraProtocol, GlRendererProtocol } from "@/domain/protocols";
import { GlRendererHandler, GlRendererShapeStyleHandler } from "../..";

export class GlRenderer extends GlRendererProtocol
{
	public readonly gl: WebGL2RenderingContext;

	public readonly canvas: HTMLCanvasElement;

	private _glRendererHandler = {} as GlRendererHandler;

	constructor(
		parentNode: HTMLElement,
		camera: CameraProtocol,
        public readonly width: number,
        public readonly height: number
	)
	{
		super(camera, width, height);

		this.canvas = document.createElement('canvas');
		this.canvas.width = width;
		this.canvas.height = height;

		const expectContext = this.canvas.getContext("webgl2");
		if (!expectContext) throw new Error(`Fail to attempt get Webgl2 context`);

		parentNode.append(this.canvas);

		this.gl = expectContext;
	}

	protected _Prepare(): void
	{
		const { width, height } = this.canvas;
		this.gl.viewport(0, 0, width, height);
		this.gl.clearColor(0.2, 0.23, 0.34, 1);

		const glRendererShapeStyleHandler = new GlRendererShapeStyleHandler();
		this._glRendererHandler = new GlRendererHandler(glRendererShapeStyleHandler);
	}

	protected _BeforeRender(): void
	{
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);
	}

	protected _Render(): void
	{
		this._actors.forEach(actor =>
		{
			this._glRendererHandler.Handle(this, actor);
		});
	}
}
