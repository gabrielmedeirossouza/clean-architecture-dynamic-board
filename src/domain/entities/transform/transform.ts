import { Observable, Position } from '..';

type TransformObserverMap = {
    "on-change": () => void
}

export class Transform
{
	public readonly observable = new Observable<TransformObserverMap>();

	constructor(
        public readonly position: Position,
	)
	{}

	public SetParent(parent: Transform): void
	{
		this.position.SetParent(parent.position);
	}

	public UnsetParent(): void
	{
		this.position.UnsetParent();
	}

	public AttachChild(child: Transform): void
	{
		this.position.AttachChild(child.position);
	}

	public DetachChild(child: Transform): void
	{
		this.position.DetachChild(child.position);
	}
}
