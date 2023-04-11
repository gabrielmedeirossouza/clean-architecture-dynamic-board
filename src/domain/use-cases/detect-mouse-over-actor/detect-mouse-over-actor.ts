import { AABB, Matrix4, Vector2 } from "@/core";
import { Actor, CameraProtocol, ShapeStyleProtocol } from "@/domain";

export class DetectMouseOverActor
{
	constructor(
        private readonly _camera: CameraProtocol,
        private readonly _actors: Actor[]
	)
	{}

	public MouseOverActors(mousePos: Vector2): Actor[]
	{
		const actors: Actor[] = [];

		for (const actor of this._actors)
		{
			if (this._CheckIsMouseOverActor(actor, mousePos))
				actors.push(actor);
		}

		return actors;
	}

	private _CheckIsMouseOverActor(actor: Actor, mousePos: Vector2): boolean
	{
		if (!actor.style || !actor.style.isVisible || !(actor.style instanceof ShapeStyleProtocol)) return false;

		const { projection, viewportX, viewportY } = this._camera;

		const screenSpaceMousePos = Vector2.NDC(mousePos, viewportX, viewportY);

		const normalizedProjection = Matrix4.NDC(projection, viewportX, viewportY);
		const normalizedActorPos = Vector2.NDC(actor.transform.position.world, viewportX, viewportY);
		const normalizedActorSize = Vector2.NDC(
			new Vector2(
				actor.style.width.value,
				actor.style.height.value
			),
			viewportX,
			viewportY
		);

		const screenSpaceActorPos = Vector2.FromMatrix4(
			Matrix4.Multiply(
				normalizedProjection,
				Matrix4.FromVector2(normalizedActorPos),
			)
		);

		const actorAABB = new AABB(
			new Vector2(
				screenSpaceActorPos.x - ((1 + normalizedActorSize.x) * 0.5),
				screenSpaceActorPos.y - ((1 + normalizedActorSize.y) * 0.5),
			),
			1 + normalizedActorSize.x,
			1 + normalizedActorSize.y
		);

		return AABB.IsCollidingAABBWithPoint(actorAABB, screenSpaceMousePos);
	}
}
