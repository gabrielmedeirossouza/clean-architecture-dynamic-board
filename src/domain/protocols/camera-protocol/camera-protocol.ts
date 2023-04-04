import { Matrix4 } from "@/core/math";
import { Observable } from "@/domain/entities";

type CameraObserverMap = {
    "on-change": () => void;
}

export abstract class CameraProtocol
{
	public readonly observable = new Observable<CameraObserverMap>();

	constructor(
        private _projection: Matrix4
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
