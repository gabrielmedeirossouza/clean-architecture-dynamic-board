import { Board } from '@/application';
import { GlStyle, MeasurementUnit, UnitType, ShapeStyle, Color, GlRenderer, CameraOrthographic } from '@/infrastructure';
import { Element, Transform } from '@/domain/entities';
import { Matrix4, Vector2, Vector3 } from '@/core/math';
import { MathHelper } from './helpers/math-helper';

const camera = new CameraOrthographic(0, window.innerWidth, 0, window.innerHeight, 0, 1000);

const renderer = new GlRenderer(
    document.querySelector("#board") as HTMLElement,
    camera,
    window.innerWidth,
    window.innerHeight
);
const board = new Board(renderer);

const elementA = new Element("A", new Transform(new Vector2(1400, 0)));
const elementStyle = new GlStyle(
	new ShapeStyle({
		color: new Color(160, 80, 80, 1),
		width: new MeasurementUnit(250, UnitType.PX),
		height: new MeasurementUnit(250, UnitType.PX),
		cornerRadius: new MeasurementUnit(12, UnitType.PX)
	})
);
elementA.style = elementStyle;

const elementB = new Element("B", new Transform(new Vector2(1400, 0)));
const elementStyleB = new GlStyle(
	new ShapeStyle({
		color: new Color(160, 160, 160, 1),
		width: new MeasurementUnit(150, UnitType.PX),
		height: new MeasurementUnit(250, UnitType.PX),
		cornerRadius: new MeasurementUnit(12, UnitType.PX)
	})
);
elementB.style = elementStyleB;

board.AttachElement(elementA);
board.AttachElement(elementB);
board.AttachElement(elementB);

let x= 0;
setInterval(() => {
	elementA.transform.position = new Vector2(x, 0);
	x += 10;
}, 20);

let clicked = false;

window.addEventListener("keydown", (e) => {
	if (e.key === "w") {
		elementA.AttachChild(elementB);
	} else {
		elementA.DetachChild(elementB);
	}
});

window.addEventListener("mousedown", () => {
	clicked = true;
});

window.addEventListener("mouseup", () => {
	clicked = false;
});

window.addEventListener("mousemove", (e) => {
	if (!clicked) return;

	camera.projection = Matrix4.SetPosition(camera.projection, translateNormalizedCamera(e));
});

const cameraLocation = new Vector2(0, 0);
function translateNormalizedCamera(e: MouseEvent): Vector3 {
	cameraLocation.x += e.movementX;
	cameraLocation.y += -e.movementY;

	const ndc = MathHelper.NDC(new Vector2(window.innerWidth, window.innerHeight), cameraLocation);

	return new Vector3(ndc.x, ndc.y, 0);
}
