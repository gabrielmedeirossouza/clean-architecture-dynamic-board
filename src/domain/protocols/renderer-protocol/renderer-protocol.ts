import { Actor, Observable } from '@/domain/entities';
import { CameraProtocol } from '..';

type RendererObserverMap = {
    "on-load-actors": (actors: Actor[]) => void;
    "on-unload-actors": (actors: Actor[]) => void;
}

export abstract class RendererProtocol
{
	public readonly observable = new Observable<RendererObserverMap>();

	protected _actors: Actor[] = [];

	private _loaded = false; // TODO: Review a best way to do that.

	constructor(
        public readonly camera: CameraProtocol
	)
	{
		this.camera.observable.Subscribe("on-change", this._Update.bind(this));
	}

	public LoadActors(actors: Actor[]): void
	{
		actors.forEach((actor) =>
		{
			const index = this._actors.indexOf(actor);

			if (index !== -1)
			{
				console.warn(`Actor ${actor.name} already attached`);

				return;
			}

			this._actors.push(actor);
		});

		this.observable.Notify("on-load-actors", actors);
		this._Update();
	}

	public UnloadActors(actors: Actor[]): void
	{
		const unloadedActors: Actor[] = [];
		actors.forEach(actor =>
		{
			const index = this._actors.indexOf(actor);

			if (index === -1) return;

			this._actors.splice(index, 1);
			unloadedActors.push(actor);
		});

		this.observable.Notify("on-unload-actors", unloadedActors);
		this._Update();
	}

	private _Update(): void
	{
		if (!this._loaded)
		{
			this._Prepare?.();
			this._loaded = true;
		}
		// TODO: Review a best way to do that.
		this._BeforeRender?.();
		this._Render?.();
		this._AfterRender?.();
	}

	protected _Prepare?(): void;
	protected _BeforeRender?(): void;
	protected _Render?(): void;
	protected _AfterRender?(): void;
}
