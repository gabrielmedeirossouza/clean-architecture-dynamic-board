import { Board } from '@/application';
import { GlStyle, MeasurementUnit, UnitType, ShapeStyle, Color, GlRenderer } from '@/infrastructure';
import { Element, Transform } from '@/domain/entities';
import { MoveElementByDragAndDrop } from '@/domain/use-cases';
import { Vector2 } from '@/core/math';

const renderer = new GlRenderer(
    document.querySelector("#board") as HTMLElement,
    window.innerWidth,
    window.innerHeight
);
const board = new Board(renderer);

const elementA = new Element("A", new Transform(new Vector2(200, 400)));
const elementStyle = new GlStyle(
	new ShapeStyle({
		color: new Color(160, 80, 80, 1),
		width: new MeasurementUnit(250, UnitType.PX),
		height: new MeasurementUnit(250, UnitType.PX),
		cornerRadius: new MeasurementUnit(12, UnitType.PX)
	})
);

elementA.style = elementStyle;

board.AttachElement(elementA);

elementA.transform.position = new Vector2(0, 0);

new MoveElementByDragAndDrop(elementA);
