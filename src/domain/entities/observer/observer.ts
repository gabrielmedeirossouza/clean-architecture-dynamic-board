export type Event = `on-${string}`;
export type Callback = (...args: any[]) => void;

export class Observer<E extends Event, C extends Callback> {
	constructor(
      public readonly event: E,
      public readonly callback: C
	) {}
}
