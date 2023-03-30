import { Element, Observer } from '@/domain/entities';
import { RendererProtocol } from '@/domain/protocols';

export class Board {
	private _events = new Map<string, Function>();

	private _elements: Element[] = [];

	constructor(
        private readonly _renderer: RendererProtocol
	) {
		this._Start();
	}

	public get elements(): Element[] {
		return this._elements;
	}

	public AttachElement(element: Element): void {
		if (this._elements.includes(element)) return; // TODO: Throw a log

		this.elements.push(element);
		this._renderer.LoadElement(element);
		this._renderer.Update();

		const observer = element.transform.observable.Subscribe(new Observer("on-change", () => {
			this._renderer.Update();
		}));

		this._events.set(element.uuid, observer);
	}

	public DetachElement(element: Element): void {
		const index = this._elements.indexOf(element);

		if (index === -1) return;

		this._elements.splice(index, 1);
		this._events.delete(element.uuid);
		this._renderer.UnloadElement(element);
		this._renderer.Update();
	}

	private _Start(): void {
		this._renderer.Update();
	}
}
