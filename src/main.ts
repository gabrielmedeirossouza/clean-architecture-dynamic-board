import { Board } from '@/application';
import { GlStyle, MeasurementUnit, UnitType, ShapeStyle, Color, GlRenderer, CameraOrthographic } from '@/infrastructure';
import { Actor, Transform } from '@/domain/entities';
import { Matrix4, Vector2, Vector3 } from '@/core/math';

const camera = new CameraOrthographic(0, window.innerWidth, 0, window.innerHeight, 0, 1000);

const renderer = new GlRenderer(
    document.querySelector("#board") as HTMLElement,
    camera,
    window.innerWidth,
    window.innerHeight
);
const board = new Board(renderer);

const actorA = new Actor("A", new Transform(new Vector2(1400, 0)));
const actorStyle = new GlStyle(
	new ShapeStyle({
		color: new Color(160, 80, 80, 1),
		width: new MeasurementUnit(250, UnitType.PX),
		height: new MeasurementUnit(250, UnitType.PX),
		cornerRadius: new MeasurementUnit(12, UnitType.PX)
	})
);
actorA.style = actorStyle;

const actors: Actor[] = [];
for (let i = 0; i < 500; i++) {
	const randomPosition = new Vector2(Math.random() * 1000, Math.random() * 1000);
	const randomSize = new Vector2((Math.random() * 100) + 15, (Math.random() * 100) + 15);
	const randomColor = new Color(Math.random() * 255, Math.random() * 255, Math.random() * 255, 1);

	const randomActor = new Actor("Random", new Transform(randomPosition));
	const randomActorStyle = new GlStyle(
		new ShapeStyle({
			color: randomColor,
			width: new MeasurementUnit(randomSize.x, UnitType.PX),
			height: new MeasurementUnit(randomSize.y, UnitType.PX),
			cornerRadius: new MeasurementUnit(12, UnitType.PX)
		})
	);
	randomActor.style = randomActorStyle;

	actors.push(randomActor);
}
board.AttachActors(...actors);

let clicked = false;
window.addEventListener("mousedown", () => {
	clicked = true;
});

window.addEventListener("mouseup", () => {
	clicked = false;
});

window.addEventListener("mousemove", (e) => {
	if (!clicked) return;

	camera.projection = Matrix4.Translate(camera.projection, new Vector3(e.movementX, -e.movementY, 0));
});
