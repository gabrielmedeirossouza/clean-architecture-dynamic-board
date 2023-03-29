import { Vector } from './vector';

export class Vector4 extends Vector<Vector4> {
	constructor(
    public x: number,
    public y: number,
    public z: number,
    public w: number
	) {
		super();
	}

	public static get one(): Vector4 {
		return new Vector4(1, 1, 1, 1);
	}

	public static get zero(): Vector4 {
		return new Vector4(0, 0, 0, 0);
	}

	public Clone(): Vector4 {
		return new Vector4(this.x, this.y, this.z, this.w);
	}

	public *[Symbol.iterator](): Generator<number> {
		yield this.x;
		yield this.y;
		yield this.z;
		yield this.w;
	}
}
