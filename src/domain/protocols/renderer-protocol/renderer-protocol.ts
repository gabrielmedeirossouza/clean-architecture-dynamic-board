import { Actor, Observable, Observer } from '@/domain/entities';
import { CameraProtocol } from '..';

export type RendererObserverMap = {
    "on-load-actors": (actors: Actor[]) => void;
    "on-unload-actors": (actors: Actor[]) => void;
}

export abstract class RendererProtocol
{
	public readonly observable = new Observable<RendererObserverMap>();

	protected _actors: Actor[] = [];

	constructor(
        public readonly camera: CameraProtocol
	)
	{
		this.camera.observable.Subscribe(new Observer("on-change", this._Update.bind(this)));

		this._Prepare?.();
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
		this._BeforeRender?.();
		this._Render?.();
		this._AfterRender?.();
	}

	protected _Prepare?(): void;
	protected _BeforeRender?(): void;
	protected _Render?(): void;
	protected _AfterRender?(): void;
}
