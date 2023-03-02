import { Observer } from '../observer';
import type { Event, Callback } from '../observer';

type ObserverMap = {
  [key: Event]: Callback
};
type EventOf<T> = keyof T & Event;
type CallbackOf<T> = T[keyof T] & Callback;
type ObserverOf<T extends ObserverMap> = Observer<EventOf<T>, CallbackOf<T>>

export class Observable<T extends ObserverMap> {
	private _observers: ObserverOf<T>[] = [];

	public get Observers(): ObserverOf<T>[] {
		return this._observers;
	}

	public Subscribe(observer: ObserverOf<T>): CallbackOf<T> {
		this._observers.push(observer);

		return observer.callback;
	}

	public Unsubscribe(observer: CallbackOf<T>): void {
		const observers = this._observers.filter(filterObserver => filterObserver.callback !== observer);

		this._observers = observers;
	}

	public Notify<A extends EventOf<T>>(event: A, ...args: Parameters<T[A]>): void {
		this._observers.forEach(observer => {
			if (observer.event === event) {
				observer.callback(...args);
			}
		});
	}
}
