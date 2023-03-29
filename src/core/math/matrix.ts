export abstract class Matrix<T extends Matrix<T>> {
  public abstract readonly stride: number

  public abstract data: Array<number>

  public abstract Clone(): T

  public *[Symbol.iterator](): Generator<number> {
  	for (let i = 0; i <= this.data.length; i++) {
  		yield this.data[i];
  	}
  }
}
