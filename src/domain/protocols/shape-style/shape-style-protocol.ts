import { MeasurementUnitProtocol, ColorProtocol } from '..';

export interface ShapeStyleProtocol {
    color: ColorProtocol
    width: MeasurementUnitProtocol
    height: MeasurementUnitProtocol
    cornerRadius: MeasurementUnitProtocol
}
