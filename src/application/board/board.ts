import { Actor, Observer } from '@/domain/entities';
import { RendererProtocol } from '@/domain/protocols';

export class Board {
	private _events = new Map<string, Function>();

	private _actors: Actor[] = [];

	constructor(
        private readonly _renderer: RendererProtocol
	) {
		this._Start();
	}

	public get actors(): Actor[] {
		return this._actors;
	}

	public AttachActors(...actors: Actor[]): void {
		actors.forEach((actor) => {
			if (this._actors.includes(actor)) return; // TODO: Throw a log

			this.actors.push(actor);
			this._renderer.LoadActor(actor);

			const observer = actor.transform.observable.Subscribe(new Observer("on-change", () => {
				this._renderer.Render();
			}));

			this._events.set(actor.uuid, observer);
		});

		this._renderer.Render();
	}

	public DetachActor(actor: Actor): void {
		const index = this._actors.indexOf(actor);

		if (index === -1) return;

		this._actors.splice(index, 1);
		this._events.delete(actor.uuid);
		this._renderer.UnloadActor(actor);
		this._renderer.Render();
	}

	private _Start(): void {
		this._renderer.Render();
	}
}
