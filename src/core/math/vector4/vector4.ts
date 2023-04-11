import { Vector } from '../vector';
import { Vector2 } from '../vector2';
import { Vector3 } from '../vector3';

export class Vector4 extends Vector<Vector4>
{
	constructor(
        public x: number,
        public y: number,
        public z: number,
        public w: number
	)
	{
		super();
	}

	public static get one(): Vector4
	{
		return new Vector4(1, 1, 1, 1);
	}

	public static get zero(): Vector4
	{
		return new Vector4(0, 0, 0, 0);
	}

	public static FromVector2(vector: Vector2): Vector4
	{
		return new Vector4(vector.x, vector.y, 0, 0);
	}

	public static FromVector3(vector: Vector3): Vector4
	{
		return new Vector4(vector.x, vector.y, vector.z, 0);
	}

	public Clone(): Vector4
	{
		return new Vector4(this.x, this.y, this.z, this.w);
	}

	public *[Symbol.iterator](): Generator<number>
	{
		yield this.x;
		yield this.y;
		yield this.z;
		yield this.w;
	}
}
