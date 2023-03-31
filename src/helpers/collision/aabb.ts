import { Vector2 } from "@/core/math";

export class AABB
{
	private _x: number;

	private _y: number;

	private _width: number;

	private _height: number;

	constructor(point: Vector2, width: number, height: number)
	{
		this._x = point.x;
		this._y = point.y;
		this._width = width;
		this._height = height;
	}

	public static IsCollidingAABBWithPoint(aabb: AABB, point: Vector2): boolean
	{
		const isIntersectingX = point.x <= aabb.x + aabb.width && point.x >= aabb.x;
		const isIntersectingY = point.y <= aabb.y + aabb.height && point.y >= aabb.y;

		return isIntersectingX && isIntersectingY;
	}

	public static IsCollidingAABBWithAABB(a: AABB, b: AABB): boolean
	{
		const isIntersectingX = (
			a.x <= b.x + b.width &&
        a.x + a.width >= b.x
		);

		const isIntersectingY = (
			a.y <= b.y + b.height &&
        a.y + a.height >= b.y
		);

		return isIntersectingX && isIntersectingY;
	}

	public get x(): number
	{
		return this._x;
	}

	public get y(): number
	{
		return this._y;
	}

	public get width(): number
	{
		return this._width;
	}

	public get height(): number
	{
		return this._height;
	}
}
