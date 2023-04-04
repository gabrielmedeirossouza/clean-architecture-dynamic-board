import { Actor } from '@/domain/entities';
import { RendererProtocol } from '@/domain/protocols';

export class Board
{
	private _actors: Actor[] = [];

	constructor(
        private readonly _renderer: RendererProtocol
	)
	{}

	public get actors(): ReadonlyArray<Actor>
	{
		return this._actors;
	}

	public AttachActors(actors: Actor[]): void
	{
		const actorsToAttach = actors.filter(actor =>
		{
			const index = this._actors.indexOf(actor);

			if (index !== -1)
			{
				console.warn(`Actor ${actor.name} already attached`);

				return false;
			}

			return true;
		});

		this._actors.push(...actorsToAttach);
		this._renderer.LoadActors(actorsToAttach);
	}

	public DetachActors(actors: Actor[]): void
	{
		const actorsToDetach = actors.filter(actor =>
		{
			const index = this._actors.indexOf(actor);

			if (index === -1)
			{
				console.warn(`Actor ${actor.name} not found`);

				return false;
			}

			return true;
		});

		this._actors = this._actors.filter(actor => !actorsToDetach.includes(actor));
		this._renderer.UnloadActors(actorsToDetach);
	}

	public Update(): void
	{
		this._renderer.Update();
	}
}
