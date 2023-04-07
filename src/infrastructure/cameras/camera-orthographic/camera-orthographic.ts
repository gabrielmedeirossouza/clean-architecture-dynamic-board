import { Matrix4 } from "@/core";
import { CameraProtocol } from "@/domain";

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

		const scaleX = 2 / width;
		const scaleY = 2 / height;
		const scaleZ = -2 / depth;

		const translateX = -(right + left) / width;
		const translateY = -(top + bottom) / height;
		const translateZ = -(far + near) / depth;

		const projectionMatrix = new Matrix4([
			scaleX, 0, 0, translateX,
			0, scaleY, 0, translateY,
			0, 0, scaleZ, translateZ,
			0, 0, 0, 1
		]);

		super(projectionMatrix);
	}
}
