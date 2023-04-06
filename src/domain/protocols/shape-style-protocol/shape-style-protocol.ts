import { MeasurementUnitProtocol, ColorProtocol, StyleProtocol } from '@/domain';

export abstract class ShapeStyleProtocol extends StyleProtocol
{
    public abstract readonly color: ColorProtocol

    public abstract readonly width: MeasurementUnitProtocol

    public abstract readonly height: MeasurementUnitProtocol

    public abstract readonly cornerRadius: MeasurementUnitProtocol
}
