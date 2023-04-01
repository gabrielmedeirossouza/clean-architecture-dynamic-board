import { Vector2 } from '@/core/math';
import { Observable } from '@/domain/entities';

const THROTTLE_MOUSE_DELAY = 1000 / 75;

export enum KeyboardButton {
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

export enum MouseButton {
    Unknown,
    Left,
    Middle,
    Right,
}

export type KeyboardData = {
    key: KeyboardButton
}

export type MouseData = {
    pos: Vector2,
    deltaPos: Vector2
    button: MouseButton
}

export type EventMouseMap = {
    "on-mouse-down": (data: MouseData) => void,
    "on-mouse-up": (data: MouseData) => void,
    "on-mouse-move": (data: MouseData) => void,
}

export type EventKeyboardMap = {
    "on-key-down": (data: KeyboardData) => void,
    "on-key-up": (data: KeyboardData) => void,
}

export type EventMap = EventMouseMap & EventKeyboardMap;

export class EventAdapter
{
	public readonly observable = new Observable<EventMap>();

	private readonly _pressedMouseButtons = new Set<MouseButton>();

	private readonly _pressedKeyboardButtons = new Set<KeyboardButton>();

	constructor(target: HTMLElement)
	{
		target.addEventListener("mousedown", this._HandleMouseEvents("on-mouse-down"));
		target.addEventListener("mouseup", this._HandleMouseEvents("on-mouse-up"));
		target.addEventListener("mousemove", this._HandleMouseEvents("on-mouse-move"));
		target.addEventListener("keydown", this._HandleKeyboardEvents("on-key-down"));
		target.addEventListener("keyup", this._HandleKeyboardEvents("on-key-up"));
	}

	public get pressedMouseButtons(): ReadonlySet<MouseButton>
	{
		return this._pressedMouseButtons;
	}

	public get pressedKeyboardButtons(): ReadonlySet<KeyboardButton>
	{
		return this._pressedKeyboardButtons;
	}

	private _HandleMouseEvents(eventName: keyof EventMouseMap): (event: MouseEvent) => void
	{
		let lastCall = 0;
		const lastDeltaPos = new Vector2(0, 0);

		return (event: MouseEvent) =>
		{
			event.preventDefault();
			lastDeltaPos.x = event.movementX;
			lastDeltaPos.y = event.movementY;

			const now = performance.now();
			if (now - lastCall < THROTTLE_MOUSE_DELAY) return;

			const data = {
				pos: new Vector2(event.clientX, event.clientY),
				deltaPos: lastDeltaPos,
				button: this._SetMouseButton(event.button)
			};

			this.observable.observers.forEach((observer) =>
			{
				if (eventName === observer.event) observer.callback(data);
			});

			if (eventName === "on-mouse-down") this._pressedMouseButtons.add(data.button);
			if (eventName === "on-mouse-up") this._pressedMouseButtons.delete(data.button);

			lastCall = now;

			lastDeltaPos.x = 0;
			lastDeltaPos.y = 0;
		};
	}

	private _HandleKeyboardEvents(eventName: keyof EventKeyboardMap): (event: KeyboardEvent) => void
	{
		return (event: KeyboardEvent) =>
		{
			event.preventDefault();
			const data = {
				key: this._SetKeyboardButton(event.key)
			};

			this.observable.observers.forEach((observer) =>
			{
				if (eventName === observer.event) observer.callback(data);
			});

			if (eventName === "on-key-down") this._pressedKeyboardButtons.add(data.key);
			if (eventName === "on-key-up") this._pressedKeyboardButtons.delete(data.key);
		};
	}

	private _SetMouseButton(possibleButton: number): MouseButton
	{
		const BUTTON_MAP = new Map<number, MouseButton>([
			[0, MouseButton.Left],
			[1, MouseButton.Middle],
			[2, MouseButton.Right]
		]);

		const button = BUTTON_MAP.get(possibleButton) ?? MouseButton.Unknown;
		this._pressedMouseButtons.add(button);

		return button;
	}

	private _SetKeyboardButton(possibleKey: string): KeyboardButton
	{
		const possibleKeyLowercase = possibleKey.toLowerCase();

		const KEY_MAP = new Map<string, KeyboardButton>([
			["0", KeyboardButton.Zero],
			["1", KeyboardButton.One],
			["2", KeyboardButton.Two],
			["3", KeyboardButton.Three],
			["4", KeyboardButton.Four],
			["5", KeyboardButton.Five],
			["6", KeyboardButton.Six],
			["7", KeyboardButton.Seven],
			["8", KeyboardButton.Eight],
			["9", KeyboardButton.Nine],
			["a", KeyboardButton.A],
			["b", KeyboardButton.B],
			["c", KeyboardButton.C],
			["d", KeyboardButton.D],
			["e", KeyboardButton.E],
			["f", KeyboardButton.F],
			["g", KeyboardButton.G],
			["h", KeyboardButton.H],
			["i", KeyboardButton.I],
			["j", KeyboardButton.J],
			["k", KeyboardButton.K],
			["l", KeyboardButton.L],
			["m", KeyboardButton.M],
			["n", KeyboardButton.N],
			["o", KeyboardButton.O],
			["p", KeyboardButton.P],
			["q", KeyboardButton.Q],
			["r", KeyboardButton.R],
			["s", KeyboardButton.S],
			["t", KeyboardButton.T],
			["u", KeyboardButton.U],
			["v", KeyboardButton.V],
			["w", KeyboardButton.W],
			["x", KeyboardButton.X],
			["y", KeyboardButton.Y],
			["z", KeyboardButton.Z],
			[" ", KeyboardButton.Space],
			["enter", KeyboardButton.Enter],
			["escape", KeyboardButton.Escape],
			["arrowup", KeyboardButton.ArrowUp],
			["arrowdown", KeyboardButton.ArrowDown],
			["arrowleft", KeyboardButton.ArrowLeft],
			["arrowright", KeyboardButton.ArrowRight],
		]);

		const key = KEY_MAP.get(possibleKeyLowercase) ?? KeyboardButton.Unknown;
		this._pressedKeyboardButtons.add(key);

		return key;
	}
}
