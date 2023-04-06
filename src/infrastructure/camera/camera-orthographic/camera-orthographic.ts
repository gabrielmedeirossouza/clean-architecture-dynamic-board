import { Matrix4 } from "@/core/math";
import { CameraProtocol } from "@/domain/protocols";

export class CameraOrthographic extends CameraProtocol
{
	constructor(
		left: number,
		right: number,
		bottom: number,
		top: number,
		near: number,
		far: number
	)
	{
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

		super(projectionMatrix);
	}
}
