import { Actor } from "@/domain/entities";
import { RendererProtocol } from "..";

export abstract class RendererHandlerProtocol
{
	constructor(
        private readonly _next?: RendererHandlerProtocol
	)
	{}

	public abstract Handle(renderer: RendererProtocol, actor: Actor): void

	protected _Next(renderer: RendererProtocol, actor: Actor): void
	{
    	if (this._next) this._next.Handle(renderer, actor);
    	else console.warn(`No next renderer handler`);
	}
}
