
import { CameraProtocol, CanvasProviderProtocol } from "@/domain";
import { RendererProtocol } from "../renderer-protocol";

export abstract class GlRendererProtocol<T> extends RendererProtocol
{
	public readonly width: number;

	public readonly height: number;

	public readonly gl: T;

	constructor(
		camera: CameraProtocol,
		canvasProvider: CanvasProviderProtocol<T>,
	)
	{
		super(camera);

		this.width = canvasProvider.width;
		this.height = canvasProvider.height;
		this.gl = canvasProvider.context;
	}
}
