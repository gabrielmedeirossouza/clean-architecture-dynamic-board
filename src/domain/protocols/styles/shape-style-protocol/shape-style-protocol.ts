import { Vector2 } from "@/core";
import { ColorProtocol } from "../color-protocol";
import { MeasurementUnitProtocol } from "../measurement-unit-protocol";
import { StyleProtocol } from "../style-protocol";

export abstract class ShapeStyleProtocol extends StyleProtocol
{
    public abstract readonly color: ColorProtocol

    public abstract readonly width: MeasurementUnitProtocol

    public abstract readonly height: MeasurementUnitProtocol

    public abstract readonly cornerRadius: MeasurementUnitProtocol

    public abstract readonly pivot: Vector2
}
