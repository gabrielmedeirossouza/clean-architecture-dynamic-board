import { M, Matrix4 } from "../matrix4";
import { Vector } from "../vector";
import { Vector3 } from "../vector3";
import { Vector4 } from "../vector4";

export class Vector2 extends Vector<Vector2>
{
	constructor(
        public x: number,
        public y: number
	)
	{
		super();
	}

	public static get one(): Vector2
	{
		return new Vector2(1, 1);
	}

	public static get zero(): Vector2
	{
		return new Vector2(0, 0);
	}

	public static get up(): Vector2
	{
		return new Vector2(0, 1);
	}

	public static get down(): Vector2
	{
		return new Vector2(0, -1);
	}

	public static get left(): Vector2
	{
		return new Vector2(-1, 0);
	}

	public static get right(): Vector2
	{
		return new Vector2(1, 0);
	}

	public static Add(a: Vector2, b: Vector2): Vector2
	{
		return new Vector2(a.x + b.x, a.y + b.y);
	}

	public static Subtract(a: Vector2, b: Vector2): Vector2
	{
		return new Vector2(a.x - b.x, a.y - b.y);
	}

	public static Multiply(a: Vector2, b: Vector2): Vector2
	{
		return new Vector2(a.x * b.x, a.y * b.y);
	}

	public static MultiplyScalar(a: Vector2, b: number): Vector2
	{
		return new Vector2(a.x * b, a.y * b);
	}

	public static Divide(a: Vector2, b: Vector2): Vector2
	{
		return new Vector2(a.x / b.x, a.y / b.y);
	}

	public static DivideScalar(a: Vector2, scalar: number): Vector2
	{
		return new Vector2(a.x / scalar, a.y / scalar);
	}

	public static Dot(a: Vector2, b: Vector2): number
	{
		return a.x * b.x + a.y * b.y;
	}

	public static PerpendicularClockwise(a: Vector2): Vector2
	{
		return new Vector2(a.y, a.x * -1);
	}

	public static PerpendicularCounterClockwise(a: Vector2): Vector2
	{
		return new Vector2(a.y * -1, a.x);
	}

	public static Rotate(vector: Vector2, angle: number): Vector2
	{
		const cos = Math.cos(angle);
		const sin = Math.sin(angle);

		const x = vector.x * cos - vector.y * sin;
		const y = vector.x * sin + vector.y * cos;

		return new Vector2(x, y);
	}

	public static Negate(vector: Vector2): Vector2
	{
		return new Vector2(vector.x * -1, vector.y * -1);
	}

	public static FromVector3(vector: Vector3): Vector2
	{
		return new Vector2(vector.x, vector.y);
	}

	public static FromVector4(vector: Vector4): Vector2
	{
		return new Vector2(vector.x, vector.y);
	}

	public static FromMatrix4(matrix: Matrix4): Vector2
	{
		return new Vector2(matrix.data[M.a14], matrix.data[M.a24]);
	}

	public static NDC(vector: Vector2, viewportWidth: number, viewportHeight: number): Vector2
	{
		const x = (vector.x / viewportWidth) * 2 - 1;
		const y = (vector.y / viewportHeight) * 2 - 1;

		return new Vector2(x, y);
	}

	public get magnitude(): number
	{
		return Math.sqrt(this.x ** 2 + this.y ** 2);
	}

	public get magnitudeSquared(): number
	{
		return this.x ** 2 + this.y ** 2;
	}

	public get normalized(): Vector2
	{
		const normalizedX = this.x / this.magnitude || 0;
		const normalizedY = this.y / this.magnitude || 0;

		return new Vector2(normalizedX, normalizedY);
	}

	public Clone(): Vector2
	{
		return new Vector2(this.x, this.y);
	}

	public *[Symbol.iterator](): Generator<number>
	{
		yield this.x;
		yield this.y;
	}
}
