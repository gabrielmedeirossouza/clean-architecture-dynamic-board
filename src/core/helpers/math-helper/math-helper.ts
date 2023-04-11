import { Vector2 } from "@/core/math";

type Clamp = {
    value: number;
    isClamped: boolean;
    isClampedMin: boolean;
    isClampedMax: boolean;
}

export class MathHelper
{
	public static DegreesToRadians(degrees: number): number
	{
		return degrees * Math.PI / 180;
	}

	public static RadiansToDegrees(radians: number): number
	{
		return radians * 180 / Math.PI;
	}

	public static Clamp(value: number, min: number, max: number): Clamp
	{
		if (value < min)
			return { value: min, isClamped: true, isClampedMin: true, isClampedMax: false };

		if (value > max)
			return { value: max, isClamped: true, isClampedMin: false, isClampedMax: true };

		return { value, isClamped: false, isClampedMin: false, isClampedMax: false };
	}

	/**
     * @description Transforms a point from screen space to normalized device coordinates (NDC).
     * @param x - The x coordinate of the point to transform.
     * @param y - The y coordinate of the point to transform.
     * @param viewportWidth - The width of the viewport/screen/device.
     * @param viewportHeight - The height of the viewport/screen/device.
     * @returns A tuple containing the x and y coordinates of the transformed point.
     */
	public static NDC(x: number, y: number, viewportWidth: number, viewportHeight: number): Vector2
	{
		return new Vector2(
			(x / viewportWidth) * 2 - 1,
			(y / viewportHeight) * 2 - 1
		);
	}
}
