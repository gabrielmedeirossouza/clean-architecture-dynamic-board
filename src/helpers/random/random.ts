export class Random
{
	public static GenerateUUID(): string
	{
		return crypto.randomUUID();
	}
}
