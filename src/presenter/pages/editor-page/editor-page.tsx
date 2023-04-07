import { Board } from '@/application';
import { CameraOrthographic } from '@/infrastructure';
import { GlRenderer, GlCanvasProvider, GlRendererShapeStyleHandler, GlRendererHandler } from '@/presenter';
import React from 'react';

export function EditorPage(): JSX.Element
{
	const boardRef = React.useRef<HTMLDivElement>(null);

	React.useEffect(() =>
	{
		if (!boardRef.current) return;

		const camera = new CameraOrthographic(0, window.innerWidth, 0, window.innerHeight, 0, 1000);
		const canvasProvider = new GlCanvasProvider(boardRef.current);

		const glRendererShapeStyleHandler = new GlRendererShapeStyleHandler();
		const rendererHandler = new GlRendererHandler(glRendererShapeStyleHandler);

		const renderer = new GlRenderer(camera, canvasProvider, rendererHandler);
		const board = new Board(renderer);
	}, [boardRef]);

	return (
		<div ref={boardRef}></div>
	);
}
