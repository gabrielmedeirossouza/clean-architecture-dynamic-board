import { MeasurementUnitProtocol, MeasurementUnitType as UnitType } from "@/domain/protocols";
export { MeasurementUnitType as UnitType } from "@/domain/protocols";

export class MeasurementUnit implements MeasurementUnitProtocol {
	constructor(
        public readonly value: number,
        public readonly type: UnitType
	) {}

	public static get zero(): MeasurementUnit {
		return new MeasurementUnit(0, UnitType.PX);
	}
}
