import { Element } from '@/domain/entities';

export abstract class RendererProtocol {
	protected _elements: Element[] = [];

	public Update(): void {
		this._Render();
	}

	public LoadElement(element: Element): void {
		this._elements.push(element);
	}

	public UnloadElement(element: Element): void {
		const index = this._elements.indexOf(element);

		if (index === -1) return;

		this._elements.splice(index, 1);
	}

    protected abstract _Render(): void;
}
