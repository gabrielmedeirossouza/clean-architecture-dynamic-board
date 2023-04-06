import { RendererHandlerProtocol } from "@/domain";

export abstract class GlRendererHandlerProtocol extends RendererHandlerProtocol
{
	constructor(
		next?: GlRendererHandlerProtocol
	)
	{
		super(next);
	}
}
