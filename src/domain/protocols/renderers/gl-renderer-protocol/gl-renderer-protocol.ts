import { CameraProtocol, CanvasProviderProtocol, RendererProtocol } from "@/domain";

export abstract class GlRendererProtocol<T> extends RendererProtocol
{
	constructor(
		camera: CameraProtocol,
		public readonly canvasProvider: CanvasProviderProtocol<T>,
	)
	{
		super(camera);
	}
}
