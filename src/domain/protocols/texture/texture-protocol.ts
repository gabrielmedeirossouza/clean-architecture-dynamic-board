import { ShapeStyleProtocol } from '..';

type Style = ShapeStyleProtocol

export abstract class TextureProtocol {
	public isVisible = true;

	constructor(
        public readonly style: Style
	) {}
}
