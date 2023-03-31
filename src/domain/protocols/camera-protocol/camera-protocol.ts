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

	/**
     * @description Get a copy of the projection matrix of the camera. Do not modify the returned value!!!
     */
	public get projection(): Readonly<Matrix4>
	{ // TODO: Check if this is the best way to do this.
		return this._projection.Clone();
	}

	public set projection(data: Matrix4)
	{
		this._projection = data;

		this.observable.Notify("on-change");
	}
}
