import React from 'react';
import { Board } from '@/application';
import { CameraOrthographic, Color, MeasurementUnit, ShapeStyle } from '@/infrastructure';
import { GlRenderer, GlCanvasProvider } from '@/presenter';
import styles from './styles.module.scss';
import { actors } from './temp';
import { EventAdapter, Matrix4, MouseButton, Vector3 } from '@/core';
import { DetectMouseOverActor, MeasurementUnitType } from '@/domain';

export function EditorPage(): JSX.Element
{
	const boardRef = React.useRef<HTMLDivElement>(null);

	React.useEffect(() =>
	{
		if (!boardRef.current) return;

		const camera = new CameraOrthographic(0, boardRef.current.clientWidth, 0, boardRef.current.clientHeight, 0, 1000);
		const canvasProvider = new GlCanvasProvider(boardRef.current);
		const renderer = new GlRenderer(camera, canvasProvider);
		const board = new Board(renderer);

		console.log(actors);

		board.AttachActors(actors);

		board.Update();

		const boardEvent = new EventAdapter(boardRef.current);

		const mouseDetector = new DetectMouseOverActor(camera, board.actors);

		boardEvent.observable.Subscribe("on-mouse-move", ({ deltaPos }) =>
		{
			if (!boardEvent.pressedMouseButtons.has(MouseButton.Left)) return;

			camera.SetProjection(Matrix4.Translate(camera.projection, Vector3.FromVector2(deltaPos)));

			board.Update();
		});

		boardEvent.observable.Subscribe("on-mouse-move", (data) =>
		{
			const actorsOver = mouseDetector.MouseOverActors(data.pos);

			actors.forEach(actor => actor.style = new ShapeStyle({
				width: new MeasurementUnit(100, MeasurementUnitType.PX),
				height: new MeasurementUnit(100, MeasurementUnitType.PX),
				color: new Color(255, 255, 255, 1),
				cornerRadius: new MeasurementUnit(0, MeasurementUnitType.PX),
			}));

			actorsOver.forEach(actor => actor.style = new ShapeStyle({
				width: new MeasurementUnit(120, MeasurementUnitType.PX),
				height: new MeasurementUnit(120, MeasurementUnitType.PX),
				color: new Color(255, 255, 255, 1),
				cornerRadius: new MeasurementUnit(0, MeasurementUnitType.PX),
			}));

			board.Update();
		});
	}, [boardRef]);

	return (
		<div className={styles.container}>
			<section ref={boardRef} className={styles.board} />
		</div>
	);
}
