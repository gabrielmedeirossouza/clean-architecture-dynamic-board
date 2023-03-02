import { Vector2 } from "@/core/math";
import { Observable } from '../observable';

export type TransformObserverMap = {
    "on-change": () => void
}

export class Transform {
	public readonly observable = new Observable<TransformObserverMap>();

	private _parent?: Transform;

	private _children: Transform[] = [];

	private _position: Vector2;

	private _localPosition: Vector2;

	constructor(position: Vector2) {
		this._position = position;
		this._localPosition = position;
	}

	public get parent(): Transform | undefined {
		return this._parent;
	}

	public get position(): Readonly<Vector2> {
		return this._position;
	}

	public set position(value: Vector2) {
		const deltaPosition = Vector2.Subtract(value, this.position);
		this._position = value;

		/**
         * pl¹ = pw¹ - pw²
         */
		this._localPosition = Vector2.Subtract(this._position, this._parent?.position || Vector2.zero);

		this._children.forEach(child => {
			child.position = Vector2.Add(child.position, deltaPosition);
		});

		this.observable.Notify("on-change");
	}

	public get localPosition(): Readonly<Vector2> {
		return this._localPosition;
	}

	public set localPosition(value: Vector2) {
		const deltaPosition = Vector2.Subtract(value, this.position);
		this._localPosition = value;

		/**
         * pw¹ = pl¹ + pw²
         */
		this._position = Vector2.Add(this._localPosition, this._parent?.position || Vector2.zero);

		this._children.forEach(child => {
			child.position = Vector2.Add(child.position, deltaPosition);
		});

		this.observable.Notify("on-change");
	}

	public SetParent(parent: Transform): void {
		this._parent = parent;

		/**
         * pl¹ = pw¹ - pw²
         */
		this._localPosition = Vector2.Subtract(this._position, parent.position);
	}

	public UnsetParent(): void {
		this._parent = undefined;

		this._localPosition = this._position;
	}

	public AttachChild(child: Transform): Transform {
		this._children.push(child);

		return child;
	}

	public DetachChild(child: Transform): void {
		const index = this._children.indexOf(child);

		if (index === -1) return;

		this._children.splice(index, 1);
	}
}
