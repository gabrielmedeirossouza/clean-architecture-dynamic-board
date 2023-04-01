import { RendererHandlerProtocol } from "..";

export abstract class GlRendererHandlerProtocol extends RendererHandlerProtocol
{
	constructor(
		next?: GlRendererHandlerProtocol
	)
	{
		super(next);
	}
}
