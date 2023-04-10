import { ShapeStyleProtocol } from "@/domain/protocols";
import { Color, MeasurementUnit } from "..";
import { MathHelper, Vector2 } from "@/core";

const PIVOT_CENTER = new Vector2(0.5, 0.5);

interface ShapeStyleConstructor {
    width: MeasurementUnit;
    height: MeasurementUnit;
    color: Color;
    cornerRadius: MeasurementUnit;
    pivot?: Vector2;
}

export class ShapeStyle extends ShapeStyleProtocol
{
	public readonly width: MeasurementUnit;

	public readonly height: MeasurementUnit;

	public readonly color: Color;

	public readonly cornerRadius: MeasurementUnit;

	public readonly pivot: Vector2;

	constructor({ width, height, color, cornerRadius, pivot = PIVOT_CENTER }: ShapeStyleConstructor)
	{
		super();

		this.width = width;
		this.height = height;
		this.color = color;
		this.cornerRadius = cornerRadius;

		const clampedPivotX = MathHelper.Clamp(pivot.x, 0, 1);
		const clampedPivotY = MathHelper.Clamp(pivot.y, 0, 1);
		const clampedPivot = new Vector2(clampedPivotX.value, clampedPivotY.value);

		if (clampedPivotX.isClamped || clampedPivotY.isClamped)
			console.warn(`ShapeStyle: Pivot must be between 0 and 1. Received: ${pivot.ToString()}. Clamped to: ${clampedPivot.ToString()}.`);

		this.pivot = clampedPivot;
	}
}
