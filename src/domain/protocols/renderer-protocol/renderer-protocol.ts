import { Actor, Observable, Observer } from '@/domain/entities';
import { CameraProtocol } from '..';

export type RendererObserverMap = {
    "on-load-actor": (actor: Actor) => void;
    "on-unload-actor": (actor: Actor) => void;
}

export abstract class RendererProtocol
{
	public readonly observable = new Observable<RendererObserverMap>();

	protected _actors: Actor[] = [];

	constructor(
        public readonly camera: CameraProtocol
	)
	{
		this.camera.observable.Subscribe(new Observer("on-change", this.Render.bind(this)));
	}

	public Render(): void
	{
		this._BeforeRender?.();
		this._Render();
		this._AfterRender?.();
	}

	public LoadActor(actor: Actor): void
	{
		this._actors.push(actor);
		this.observable.Notify("on-load-actor", actor);
	}

	public UnloadActor(actor: Actor): void
	{
		const index = this._actors.indexOf(actor);

		if (index === -1) return;

		this._actors.splice(index, 1);
		this.observable.Notify("on-unload-actor", actor);
	}

	protected _BeforeRender?(): void;
    protected abstract _Render(): void;
    protected _AfterRender?(): void;
}
