import { Random } from '@/helpers/random';
import { StyleProtocol } from '@/domain/protocols';
import { Transform } from '../transform';

export class Element {
	public readonly uuid = Random.GenerateUUID();

	public readonly children: Element[] = [];

	public style?: StyleProtocol;

	constructor(
        public readonly name: string,
        public readonly transform: Transform
	) {}

	public AttachChild(child: Element): Element {
		if (this.children.includes(child)) return child; // TODO: Throw a log

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
