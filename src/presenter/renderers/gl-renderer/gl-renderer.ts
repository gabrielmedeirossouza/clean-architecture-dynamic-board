import { CameraProtocol, GlRendererProtocol, CanvasProviderProtocol, GlRendererHandlerProtocol } from "@/domain";
import { GlRendererHandler, GlRendererShapeStyleHandler } from "@/presenter";

export class GlRenderer extends GlRendererProtocol<WebGL2RenderingContext>
{
	private readonly _rendererHandler: GlRendererHandlerProtocol;

	constructor(
		camera: CameraProtocol,
		canvasProvider: CanvasProviderProtocol<WebGL2RenderingContext>
	)
	{
		super(camera, canvasProvider);

		const glRendererShapeStyleHandler = new GlRendererShapeStyleHandler();
		this._rendererHandler = new GlRendererHandler(glRendererShapeStyleHandler);
	}

	protected _Prepare(): void
	{
		this.gl.viewport(0, 0, this.width, this.height);
		this.gl.clearColor(0.2, 0.23, 0.34, 1);
	}

	protected _BeforeRender(): void
	{
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);
	}

	protected _Render(): void
	{
		this._actors.forEach(actor =>
		{
			this._rendererHandler.Handle(this, actor);
		});
	}
}
