import { ShapeStyleProtocol } from "@/domain/protocols";
import { Color, MeasurementUnit } from "..";

export class ShapeStyle implements ShapeStyleProtocol {
	public readonly width: MeasurementUnit;

	public readonly height: MeasurementUnit;

	public readonly color: Color;

	public readonly cornerRadius: MeasurementUnit;

	constructor({ width, height, color, cornerRadius }: ShapeStyleProtocol) {
		this.width = width;
		this.height = height;
		this.color = color;
		this.cornerRadius = cornerRadius;
	}
}
