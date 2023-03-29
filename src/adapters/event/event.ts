import { Vector2 } from '@/core/math';
import { Observable } from '@/domain/entities';

export enum Key {
    Unknown,
    Zero,
    One,
    Two,
    Three,
    Four,
    Five,
    Six,
    Seven,
    Eight,
    Nine,
    A,
    B,
    C,
    D,
    E,
    F,
    G,
    H,
    I,
    J,
    K,
    L,
    M,
    N,
    O,
    P,
    Q,
    R,
    S,
    T,
    U,
    V,
    W,
    X,
    Y,
    Z,
    Space,
    Enter,
    Escape,
    ArrowUp,
    ArrowDown,
    ArrowLeft,
    ArrowRight,
}

export type EventObserverMap = {
    "on-mouse-down": (pos: Vector2, deltaPos: Vector2) => void,
    "on-mouse-up": (pos: Vector2, deltaPos: Vector2) => void,
    "on-mouse-move": (pos: Vector2, deltaPos: Vector2) => void,
    "on-key-down": (key: Key) => void,
    "on-key-up": (key: Key) => void,
}

export class Event {
	public static readonly observable = new Observable<EventObserverMap>();

	private static _pressedKeys = new Set<Key>();

	public static get pressedKeys(): ReadonlySet<Key> {
		return Event._pressedKeys;
	}

	static {
		window.addEventListener("mousedown", (e) => {
			e.preventDefault();
			Event.observable.Notify(
				"on-mouse-down",
				new Vector2(e.clientX, (window.innerHeight -1) - e.clientY),
				new Vector2(e.movementX, -e.movementY)
			);
		});

		window.addEventListener("mouseup", (e) => {
			e.preventDefault();
			Event.observable.Notify(
				"on-mouse-up",
				new Vector2(e.clientX, (window.innerHeight -1) - e.clientY),
				new Vector2(e.movementX, -e.movementY)
			);
		});

		window.addEventListener("mousemove", (e) => {
			e.preventDefault();
			Event.observable.Notify(
				"on-mouse-move",
				new Vector2(e.clientX, (window.innerHeight -1) - e.clientY),
				new Vector2(e.movementX, -e.movementY)
			);
		});

		window.addEventListener("keydown", (e) => {
			e.preventDefault();
			if(Event._pressedKeys.has(Event._GetKey(e.key))) {
				return;
			}

			Event._pressedKeys.add(Event._GetKey(e.key));
			Event.observable.Notify("on-key-down", Event._GetKey(e.key));
		});

		window.addEventListener("keyup", (e) => {
			e.preventDefault();
			Event._pressedKeys.delete(Event._GetKey(e.key));
			Event.observable.Notify("on-key-up", Event._GetKey(e.key));
		});
	}

	private static _GetKey(possibleKey: string): Key {
		const key = possibleKey.toLowerCase();

		const KEY_MAP = new Map<string, Key>([
			["0", Key.Zero],
			["1", Key.One],
			["2", Key.Two],
			["3", Key.Three],
			["4", Key.Four],
			["5", Key.Five],
			["6", Key.Six],
			["7", Key.Seven],
			["8", Key.Eight],
			["9", Key.Nine],
			["a", Key.A],
			["b", Key.B],
			["c", Key.C],
			["d", Key.D],
			["e", Key.E],
			["f", Key.F],
			["g", Key.G],
			["h", Key.H],
			["i", Key.I],
			["j", Key.J],
			["k", Key.K],
			["l", Key.L],
			["m", Key.M],
			["n", Key.N],
			["o", Key.O],
			["p", Key.P],
			["q", Key.Q],
			["r", Key.R],
			["s", Key.S],
			["t", Key.T],
			["u", Key.U],
			["v", Key.V],
			["w", Key.W],
			["x", Key.X],
			["y", Key.Y],
			["z", Key.Z],
			[" ", Key.Space],
			["enter", Key.Enter],
			["escape", Key.Escape],
			["arrowup", Key.ArrowUp],
			["arrowdown", Key.ArrowDown],
			["arrowleft", Key.ArrowLeft],
			["arrowright", Key.ArrowRight],
		]);

		return KEY_MAP.get(key) || Key.Unknown;
	}
}
