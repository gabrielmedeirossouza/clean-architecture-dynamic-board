import { MeasurementUnitProtocol, ColorProtocol, StyleProtocol } from '..';

export interface ShapeStyleProtocol extends StyleProtocol {
    readonly color: ColorProtocol
    readonly width: MeasurementUnitProtocol
    readonly height: MeasurementUnitProtocol
    readonly cornerRadius: MeasurementUnitProtocol
}
