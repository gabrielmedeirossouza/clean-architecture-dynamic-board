import { ColorProtocol } from "@/domain";

export class Color implements ColorProtocol
{
	public readonly value: [number, number, number, number];

	constructor(r: number, g: number, b: number, a: number)
	{
		this.value = [r, g, b, a];
	}
}
