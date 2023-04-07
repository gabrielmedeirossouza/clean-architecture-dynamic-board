import React from 'react';
import { Board } from '@/application';
import { CameraOrthographic } from '@/infrastructure';
import { GlRenderer, GlCanvasProvider } from '@/presenter';
import styles from './styles.module.scss';

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

		board.Update();
	}, [boardRef]);

	return (
		<div className={styles.container}>
			<section ref={boardRef} className={styles.board} />
		</div>
	);
}
