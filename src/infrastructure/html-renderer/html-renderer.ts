import { Element } from '@/domain/entities';
import { RendererProtocol } from '@/domain/protocols';
import { HtmlTexture } from '../html-texture';

export class HtmlRenderer extends RendererProtocol {
	constructor(
        private readonly _root: HTMLDivElement,
	) {
		super();

		this._root.style.position = "relative";
	}

	protected _Render(): void {
		this._root.innerHTML = "";

		this._elements.forEach(element => {
			if (!(element.texture instanceof HtmlTexture) || !element.texture.isVisible) return;

			const htmlElement = this._CreateHtmlElement(element);
			this._root.append(htmlElement);
		});
	}

	private _CreateHtmlElement(element: Element): HTMLElement {
		const texture = element.texture!;
		const htmlElement = document.createElement('div');

		htmlElement.style.position = "absolute";
		htmlElement.style.left = `${element.transform.position.x}px`;
		htmlElement.style.top = `${element.transform.position.y}px`;
		htmlElement.style.width = `${texture.style.width.value}px`;
		htmlElement.style.height = `${texture.style.height.value}px`;

		const [r, g, b, a] = texture.style.color.value;
		htmlElement.style.backgroundColor = `rgba(${r},${g},${b},${a})`;

		htmlElement.style.borderRadius = `${texture.style.cornerRadius.value}px`;

		return htmlElement;
	}
}
