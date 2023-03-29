import { ShapeStyleProtocol } from '..';

type Style = ShapeStyleProtocol

export abstract class StyleProtocol {
	public isVisible = true;

	constructor(
        public readonly data: Style
	) {}
}
