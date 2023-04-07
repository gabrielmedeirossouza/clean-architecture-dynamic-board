import { CanvasProviderProtocol } from "@/domain";

export class GlCanvasProvider implements CanvasProviderProtocol<WebGL2RenderingContext>
{
	public readonly width: number;

	public readonly height: number;

	private _canvas: HTMLCanvasElement;

	constructor(
		parentNode: HTMLElement,
	)
	{
		this.width = parentNode.clientWidth;
		this.height = parentNode.clientHeight;

		this._canvas = document.createElement('canvas');
		this._canvas.width = this.width;
		this._canvas.height = this.height;

		const expectContext = this._canvas.getContext("webgl2");
		if (!expectContext) throw new Error(`Fail to attempt get Webgl2 context`);

		parentNode.append(this._canvas);
	}

	public get context(): WebGL2RenderingContext
	{
		return this._canvas.getContext("webgl2") as WebGL2RenderingContext;
	}
}
