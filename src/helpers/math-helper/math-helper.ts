export class MathHelper {
	public static DegreesToRadians(degrees: number): number {
		return degrees * Math.PI / 180;
	}

	public static RadiansToDegrees(radians: number): number {
		return radians * 180 / Math.PI;
	}
}
