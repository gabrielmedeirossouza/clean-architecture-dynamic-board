import { Vector } from "./vector";

export class Vector3 extends Vector<Vector3>
{
	constructor(
        public x: number,
        public y: number,
        public z: number
	)
	{
		super();
	}

	public static get one(): Vector3
	{
		return new Vector3(1, 1, 1);
	}

	public static get zero(): Vector3
	{
		return new Vector3(0, 0, 0);
	}

	public static get up(): Vector3
	{
		return new Vector3(0, 1, 0);
	}

	public static get down(): Vector3
	{
		return new Vector3(0, -1, 0);
	}

	public static get left(): Vector3
	{
		return new Vector3(-1, 0, 0);
	}

	public static get right(): Vector3
	{
		return new Vector3(1, 0, 0);
	}

	public static get front(): Vector3
	{
		return new Vector3(0, 0, 1);
	}

	public static get back(): Vector3
	{
		return new Vector3(0, 0, -1);
	}

	public Clone(): Vector3
	{
		return new Vector3(this.x, this.y, this.z);
	}

	public *[Symbol.iterator](): Generator<number>
	{
		yield this.x;
		yield this.y;
		yield this.z;
	}
}
