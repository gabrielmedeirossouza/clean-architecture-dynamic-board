import { Actor } from "@/domain/entities";
import { GlRendererHandlerProtocol, GlRendererProtocol } from "@/domain/protocols";

export class GlRendererHandler extends GlRendererHandlerProtocol
{
	constructor(
		next?: GlRendererHandler
	)
	{
		super(next);
	}

	public Handle(renderer: GlRendererProtocol, actor: Actor): void
	{
		const isToRender = actor.style && actor.style.isVisible;
		if (!isToRender) return;

		this._Next(renderer, actor);
	}
}
