import { TextureProtocol } from '@/domain/protocols';
import { Transform } from '../transform';

export class Element {
	public readonly uuid = crypto.randomUUID();

	public readonly children: Element[] = [];

	public texture?: TextureProtocol;

	constructor(
        public readonly name: string,
        public readonly transform: Transform
	) {}

	public AttachChild(child: Element): Element {
		this.children.push(child);

		this._AttachChildTransform(child);

		return child;
	}

	public DetachChild(child: Element): void {
		const index = this.children.indexOf(child);

		if (index === -1) return;

		this._DetachChildTransform(child);
		this.children.splice(index, 1);
	}

	private _AttachChildTransform(child: Element): void {
		this.transform.AttachChild(child.transform);
		child.transform.SetParent(this.transform);
	}

	private _DetachChildTransform(child: Element): void {
		this.transform.DetachChild(child.transform);
		child.transform.UnsetParent();
	}
}
