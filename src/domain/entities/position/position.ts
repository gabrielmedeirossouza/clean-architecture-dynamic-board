import { Vector2 } from "@/core";
import { Observable } from "@/domain";

type TransformObserverMap = {
    "on-change": () => void,
    "on-change-depth": () => void
    "on-change-world": () => void
    "on-change-local": () => void
}

export class Position
{
	public readonly observable = new Observable<TransformObserverMap>();

	private _parent?: Position;

	private _children = new Set<Position>();

	private _depth: number;

	private _world: Vector2;

	private _local: Vector2;

	constructor(position: Vector2, depth = 0)
	{
		this._world = position;
		this._local = position;
		this._depth = depth;
	}

	public get parent(): Position | undefined
	{
		return this._parent;
	}

	public get depth(): number
	{
		return this._depth;
	}

	public get world(): Vector2
	{
		return this._world;
	}

	public get local(): Vector2
	{
		return this._local;
	}

	public SetDepth(value: number): void
	{
		// TODO: Chain this to children and parents
		this._depth = value;
		this.observable.Notify("on-change");
		this.observable.Notify("on-change-depth");
	}

	public SetWorld(value: Vector2): void
	{
		const deltaPosition = Vector2.Subtract(value, this.world);
		this._world = value;

		/**
         * pl¹ = pw¹ - pw²
         */
		this._local = Vector2.Subtract(this._world, this._parent?.world || Vector2.zero);

		this._children.forEach(child =>
		{
			child.SetWorld(Vector2.Add(child.world, deltaPosition));
		});

		this.observable.Notify("on-change");
		this.observable.Notify("on-change-world");
	}

	public SetLocal(value: Vector2): void
	{
		const deltaPosition = Vector2.Subtract(value, this.world);
		this._local = value;

		/**
         * pw¹ = pl¹ + pw²
         */
		this._world = Vector2.Add(this._local, this._parent?.world || Vector2.zero);

		this._children.forEach(child =>
		{
			child.SetWorld(Vector2.Add(child.world, deltaPosition));
		});

		this.observable.Notify("on-change");
		this.observable.Notify("on-change-local");
	}

	public TranslateDepth(deltaDepth: number): void
	{
		this.SetDepth(this.depth + deltaDepth);
	}

	public TranslateWorld(deltaPosition: Vector2): void
	{
		this.SetWorld(Vector2.Add(this.world, deltaPosition));
	}

	public TranslateLocal(deltaPosition: Vector2): void
	{
		this.SetLocal(Vector2.Add(this.local, deltaPosition));
	}

	public SetParent(parent: Position): void
	{
		this._parent = parent;

		/**
         * pl¹ = pw¹ - pw²
         */
		this._local = Vector2.Subtract(this._world, parent.world);
	}

	public UnsetParent(): void
	{
		this._parent = undefined;

		this._local = this._world;
	}

	public AttachChild(child: Position): void
	{
		if (this._children.has(child))
			console.warn("Position.AttachChild: child already attached");

		this._children.add(child);
	}

	public DetachChild(child: Position): void
	{
		if (!this._children.has(child))
		{
			console.warn("Position.DetachChild: child not attached");

			return;
		}

		this._children.delete(child);
	}
}
