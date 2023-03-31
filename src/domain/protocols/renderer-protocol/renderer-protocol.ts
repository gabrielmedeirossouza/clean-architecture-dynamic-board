import { Element, Observable, Observer } from '@/domain/entities';
import { CameraProtocol } from '..';

export type RendererObserverMap = {
    "on-load-element": (element: Element) => void;
    "on-unload-element": (element: Element) => void;
}

export abstract class RendererProtocol {
	public readonly observable = new Observable<RendererObserverMap>();

	protected _elements: Element[] = [];

	constructor(
        public readonly camera: CameraProtocol
	) {
		this.camera.observable.Subscribe(new Observer("on-change", this.Render.bind(this)));
	}

	public Render(): void {
		this._BeforeRender?.();
		this._Render();
		this._AfterRender?.();
	}

	public LoadElement(element: Element): void {
		this._elements.push(element);
		this.observable.Notify("on-load-element", element);
	}

	public UnloadElement(element: Element): void {
		const index = this._elements.indexOf(element);

		if (index === -1) return;

		this._elements.splice(index, 1);
		this.observable.Notify("on-unload-element", element);
	}

	protected _BeforeRender?(): void;
    protected abstract _Render(): void;
    protected _AfterRender?(): void;
}
