import { ShapeStyleProtocol } from "@/domain/protocols";
import { Color, MeasurementUnit } from "..";

interface ShapeStyleConstructor {
    width: MeasurementUnit;
    height: MeasurementUnit;
    color: Color;
    cornerRadius: MeasurementUnit;
}

export class ShapeStyle extends ShapeStyleProtocol {
	public readonly width: MeasurementUnit;

	public readonly height: MeasurementUnit;

	public readonly color: Color;

	public readonly cornerRadius: MeasurementUnit;

	constructor({ width, height, color, cornerRadius }: ShapeStyleConstructor) {
		super();

		this.width = width;
		this.height = height;
		this.color = color;
		this.cornerRadius = cornerRadius;
	}
}
