import { Actor } from '@/domain/entities';
import { RendererProtocol } from '@/domain/protocols';

export class Board
{
	private readonly _actors: Actor[] = [];

	constructor(
        private readonly _renderer: RendererProtocol
	)
	{}

	public get actors(): ReadonlyArray<Actor>
	{
		return this._actors;
	}

	public AttachActors(...actors: Actor[]): void
	{
		actors.forEach((actor) =>
		{
			if (this._actors.includes(actor))
			{
				console.warn(`Actor ${actor.uuid} already attached`);

				return;
			}

			this._actors.push(actor);
			this._renderer.LoadActor(actor);
		});
	}

	public DetachActor(actor: Actor): void
	{
		const index = this._actors.indexOf(actor);

		if (index === -1)
		{
			console.warn(`Actor ${actor.uuid} not found`);

			return;
		}

		this._actors.splice(index, 1);
		this._renderer.UnloadActor(actor);
	}
}
