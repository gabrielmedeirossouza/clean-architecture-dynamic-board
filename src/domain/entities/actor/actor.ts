import { Random } from '@/core';
import { Transform, StyleProtocol } from '@/domain';

export class Actor
{
	public readonly uuid = Random.GenerateUUID();

	public readonly children = new Set<Actor>();

	public style?: StyleProtocol;

	constructor(
        public readonly name: string,
        public readonly transform: Transform
	)
	{}

	public SetParent(parent: Actor): void
	{
		this.transform.SetParent(parent.transform);
	}

	public UnsetParent(): void
	{
		this.transform.UnsetParent();
	}

	public AttachChild(child: Actor): void
	{
		if (this.children.has(child))
			console.warn(`Actor ${this.name} already has child ${child.name}`);

		this.children.add(child);

		this._AttachChildTransform(child);
	}

	public DetachChild(child: Actor): void
	{
		if (!this.children.has(child))
		{
			console.warn(`Actor ${this.name} doesn't have child ${child.name}`);

			return;
		}

		this.children.delete(child);

		this._DetachChildTransform(child);
	}

	private _AttachChildTransform(child: Actor): void
	{
		this.transform.AttachChild(child.transform);
		child.transform.SetParent(this.transform);
	}

	private _DetachChildTransform(child: Actor): void
	{
		this.transform.DetachChild(child.transform);
		child.transform.UnsetParent();
	}
}
