import { Vector2 } from "@/core/math";

export class MathHelper {
	public static DegreesToRadians(degrees: number): number {
		return degrees * Math.PI / 180;
	}

	public static RadiansToDegrees(radians: number): number {
		return radians * 180 / Math.PI;
	}

	// TODO: Refactor this. It's better move this to a new class called "Vector2Helper" or something like that.
	public static NDC(viewport: Vector2, location: Vector2): Vector2 {
		return new Vector2(
			(location.x / viewport.x) * 2 - 1,
			(location.y / viewport.y) * 2 - 1
		);
	}
}
