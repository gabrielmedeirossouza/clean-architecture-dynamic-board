export abstract class Matrix<T extends Matrix<T>>
{
  public abstract readonly stride: number

  public abstract data: Array<number>

  public abstract Clone(): T

  public ToString(): string
  {
  	let message = "";

  	for (let i = 0; i < this.data.length; i++)
  	{
  		const value = this.data[i];
    	message += value < 0 ? value.toFixed(2) + " " : " " + value.toFixed(2) + " ";

    	if ((i + 1) % this.stride === 0) message += "\n";
  	}

  	return message;
  }

  public *[Symbol.iterator](): Generator<number>
  {
  	for (let i = 0; i <= this.data.length; i++)
  	{
  		yield this.data[i];
  	}
  }
}
