import { Matrix4 } from "@/core";
import { Observable } from "@/domain";

type CameraObserverMap = {
    "on-change": () => void;
}

export abstract class CameraProtocol
{
	public readonly observable = new Observable<CameraObserverMap>();

	constructor(
        private _projection: Matrix4,
        public readonly viewportX: number,
        public readonly viewportY: number
	)
	{}

	public get projection(): Matrix4
	{
		return this._projection;
	}

	public SetProjection(data: Matrix4): void
	{
		this._projection = data;

		this.observable.Notify("on-change");
	}
}
