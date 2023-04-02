export abstract class Vector<T>
{
	public ToString(): string
	{
		return this._ToStringWithPrecision(2);
	}

	public ToPrecisionString(): string
	{
		return this._ToStringWithPrecision(6);
	}

	public Equals(other: Vector<T>): boolean
	{
		const allComponentsAreEqual = [...this].every((component, index) => component === [...other][index]);

		return allComponentsAreEqual;
	}

	public abstract Clone(): Vector<T>

	public abstract [Symbol.iterator](): Generator<number>

	private _ToStringWithPrecision(precision: number): string
	{
		const components = [...this].map(component => component.toFixed(precision));

		return `(${components.join(",")})`;
	}
}
