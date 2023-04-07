import { RendererHandlerProtocol } from "../renderer-handler-protocol";

export abstract class GlRendererHandlerProtocol extends RendererHandlerProtocol
{
	constructor(
		next?: GlRendererHandlerProtocol
	)
	{
		super(next);
	}
}
