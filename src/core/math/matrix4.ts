import { Matrix } from './matrix';
import { Vector3 } from ".";

enum M {
    a11, a12, a13, a14,
    a21, a22, a23, a24,
    a31, a32, a33, a34,
    a41, a42, a43, a44,
}

type Matrix4Data = [
    a11: number, a12: number, a13: number, a14: number,
    a21: number, a22: number, a23: number, a24: number,
    a31: number, a32: number, a33: number, a34: number,
    a41: number, a42: number, a43: number, a44: number,
]

export class Matrix4 extends Matrix<Matrix4> {
	public readonly stride = 4;

	constructor(
        public data: Matrix4Data,
	) {
		super();
	}

	public static get identity(): Matrix4 {
		return new Matrix4([
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1,
		]);
	}

	public static Translate(self: Matrix4, position: Vector3): Matrix4 {
		const { x, y, z } = position;

		const translationMatrix = new Matrix4([
			1, 0, 0, x,
			0, 1, 0, y,
			0, 0, 1, z,
			0, 0, 0, 1,
		]);

		return Matrix4.Multiply(self, translationMatrix);
	}

	public static Scale(self: Matrix4, scale: Vector3): Matrix4 {
		const selfClone = self.Clone();

		selfClone.data[M.a11] *= scale.x;
		selfClone.data[M.a22] *= scale.y;
		selfClone.data[M.a33] *= scale.z;

		return selfClone;
	}

	public static RotateX(self: Matrix4, radians: number): Matrix4 {
		const sin = Math.sin(radians);
		const cos = Math.cos(radians);

		const rotationMatrix = new Matrix4([
			1, 0, 0, 0,
			0, cos, sin, 0,
			0, -sin, cos, 0,
			0, 0, 0, 1
		]);

		const result = Matrix4.Multiply(self, rotationMatrix);

		return result;
	}

	public static RotateY(self: Matrix4, radians: number): Matrix4 {
		const sin = Math.sin(radians);
		const cos = Math.cos(radians);

		const rotationMatrix = new Matrix4([
			cos, 0, -sin, 0,
			0, 1, 0, 0,
			sin, 0, cos, 0,
			0, 0, 0, 1
		]);

		const result = Matrix4.Multiply(self, rotationMatrix);

		return result;
	}

	public static RotateZ(self: Matrix4, radians: number): Matrix4 {
		const sin = Number(Math.sin(radians).toFixed(4));
		const cos = Number(Math.cos(radians).toFixed(4));

		const rotationMatrix = new Matrix4([
			cos, -sin, 0, 0,
			sin, cos, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		]);

		const result = Matrix4.Multiply(self, rotationMatrix);

		return result;
	}

	public static Multiply(a: Matrix4, b: Matrix4): Matrix4 {
		const resultData = Array.from({ length: 16 }).fill(0) as Matrix4Data;

		for (let row = 0; row < 4; row++) {
			for (let col = 0; col < 4; col++) {
				let elementValue = 0;

				for (let index = 0; index < 4; index++) {
					elementValue += a.data[index + 4 * row] * b.data[col + 4 * index];
				}

				resultData[col + 4 * row] = elementValue;
			}
		}

		return new Matrix4(resultData);
	}

	public static CreateOrthographicProjection(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix4 {
		const width = right - left;
		const height = top - bottom;
		const depth = far - near;

		const tx = -(right + left) / width;
		const ty = -(top + bottom) / height;
		const tz = -(far + near) / depth;

		const projectionMatrix = new Matrix4([
			2 / width, 0, 0, tx,
			0, 2 / height, 0, ty,
			0, 0, -2 / depth, tz,
			0, 0, 0, 1
		]);

		return projectionMatrix;
	}

	public Clone(): Matrix4 {
		return new Matrix4([...this.data] as Matrix4Data);
	}
}
