import { CameraProtocol, RendererProtocol } from "..";

export abstract class GlRendererProtocol extends RendererProtocol
{
	constructor(
		camera: CameraProtocol,
        public readonly width: number,
        public readonly height: number
	)
	{
		super(camera);
	}

    public abstract readonly gl: WebGL2RenderingContext;

    public abstract readonly canvas: HTMLCanvasElement;
}
