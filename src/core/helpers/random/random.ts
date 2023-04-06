export class Random
{
	public static GenerateUUID(): string
	{
		return crypto.randomUUID(); // TODO: Replace with a custom implementation
	}
}
