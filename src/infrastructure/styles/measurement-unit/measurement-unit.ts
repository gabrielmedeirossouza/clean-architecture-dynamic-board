import { MeasurementUnitProtocol, MeasurementUnitType } from "@/domain";
export { MeasurementUnitType } from "@/domain";

export class MeasurementUnit implements MeasurementUnitProtocol
{
	constructor(
        public readonly value: number,
        public readonly type: MeasurementUnitType
	)
	{}

	public static get zero(): MeasurementUnit
	{
		return new MeasurementUnit(0, MeasurementUnitType.PX);
	}
}
