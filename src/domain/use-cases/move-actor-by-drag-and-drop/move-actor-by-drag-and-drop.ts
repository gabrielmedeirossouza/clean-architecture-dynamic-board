import { Actor, TransformObserverMap } from '@/domain/entities';
import { ObserverFactory } from  '@/factories/observer-factory';
import { Event, EventObserverMap } from '@/adapters/event';
import { AABB } from  '@/helpers/collision';
import { Vector2 } from '@/core/math';

const CreateEventObserver = new ObserverFactory<EventObserverMap>().CreateObserver;
const CreateActorTransformObserver = new ObserverFactory<TransformObserverMap>().CreateObserver;

export class MoveActorByDragAndDrop
{
	private _aabb: AABB;

	private _touchedOverActor = false;

	private _isDragging = false;

	constructor(private _actor: Actor)
	{
		this._aabb = this._UpdateAABB();

		this._actor.transform.observable.Subscribe(CreateActorTransformObserver("on-change", () =>
		{
			this._aabb = this._UpdateAABB();
		}));

		this._Start();
	}

	public get isDragging(): boolean
	{
		return this._isDragging;
	}

	private _Start(): void
	{
		Event.observable.Subscribe(CreateEventObserver("on-mouse-down", (pos) =>
		{
			if (!AABB.IsCollidingAABBWithPoint(this._aabb, pos)) return;

			this._touchedOverActor = true;
		}));

		Event.observable.Subscribe(CreateEventObserver("on-mouse-move", (_, deltaPos) =>
		{
			if (!this._touchedOverActor) return;

			this._actor.transform.position = Vector2.Add(this._actor.transform.position.Clone(), deltaPos);
		}));

		Event.observable.Subscribe(CreateEventObserver("on-mouse-up", () =>
		{
			this._ResetStates();
		}));
	}

	private _UpdateAABB(): AABB
	{
		return new AABB(
			this._actor.transform.position.Clone(),
			this._actor.style?.data.width.value || 0,
			this._actor.style?.data.height.value || 0,
		);
	}

	private _ResetStates(): void
	{
		this._touchedOverActor = false;
		this._isDragging = false;
	}
}
