import { Element, TransformObserverMap } from '@/domain/entities';
import { ObserverFactory } from  '@/factories/observer-factory';
import { Event, EventObserverMap } from '@/adapters/event';
import { AABB } from  '@/helpers/collision';
import { Vector2 } from '@/core/math';

const CreateEventObserver = new ObserverFactory<EventObserverMap>().CreateObserver;
const CreateElementTransformObserver = new ObserverFactory<TransformObserverMap>().CreateObserver;

export class MoveElementByDragAndDrop {
	private _aabb: AABB;

	private _touchedOverElement = false;

	private _isDragging = false;

	constructor(private _element: Element) {
		this._aabb = this._UpdateAABB();

		this._element.transform.observable.Subscribe(CreateElementTransformObserver("on-change", () => {
			this._aabb = this._UpdateAABB();
		}));

		this._Start();
	}

	public get isDragging(): boolean {
		return this._isDragging;
	}

	private _Start(): void {
		Event.observable.Subscribe(CreateEventObserver("on-mouse-down", (pos) => {
			if (!AABB.IsCollidingAABBWithPoint(this._aabb, pos)) return;

			this._touchedOverElement = true;
		}));

		Event.observable.Subscribe(CreateEventObserver("on-mouse-move", (_, deltaPos) => {
			if (!this._touchedOverElement) return;

			this._element.transform.position = Vector2.Add(this._element.transform.position, deltaPos);
		}));

		Event.observable.Subscribe(CreateEventObserver("on-mouse-up", () => {
			this._ResetStates();
		}));
	}

	private _UpdateAABB(): AABB {
		return new AABB(
			this._element.transform.position,
			this._element.style?.data.width.value || 0,
			this._element.style?.data.height.value || 0,
		);
	}

	private _ResetStates(): void {
		this._touchedOverElement = false;
		this._isDragging = false;
	}
}
