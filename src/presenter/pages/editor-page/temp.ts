import { Vector2 } from "@/core";
import { Actor, Position, Transform } from "@/domain";
import { Color, MeasurementUnit, MeasurementUnitType, ShapeStyle } from "@/infrastructure";

const actors: Actor[] = [];

for (let i = 0; i < 1000; i++)
{
	const position = new Position(new Vector2(Math.random() * 1600 - 800, Math.random() * 1200 - 600));
	const transform = new Transform(position);
	const actor = new Actor("actor-" + i, transform);
	actor.style = new ShapeStyle({
		width: new MeasurementUnit(100, MeasurementUnitType.PX),
		height: new MeasurementUnit(100, MeasurementUnitType.PX),
		color: new Color(Math.random() * 255, Math.random() * 255, Math.random() * 255, 1),
		cornerRadius: new MeasurementUnit(0, MeasurementUnitType.PX),
	});
	actors.push(actor);
}

export {
	actors
};
