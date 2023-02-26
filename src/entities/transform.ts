import { Vector2 } from "@/helpers/math"
import { Observable } from './observable'

export type TransformObserverMap = {
    "on-change": () => void
    "on-position-change": () => void
    "on-local-position-change": () => void
}

export class Transform {
    private _parent?: Transform
    private _children: Transform[] = []
    private _worldPosition: Vector2
    private _localPosition: Vector2
    public readonly observable = new Observable<TransformObserverMap>()

    constructor(position: Vector2) {
        this._worldPosition = position
        this._localPosition = position
    }

    public get parent(): Transform | undefined {
        return this._parent
    }

    public get worldPosition(): Readonly<Vector2> {
        return this._worldPosition
    }

    public set worldPosition(value: Vector2) {
        const deltaWorldPosition = Vector2.Subtract(value, this.worldPosition)
        this._worldPosition = value

        /**
         * pl¹ = pw¹ - pw²
         */
        this._localPosition = Vector2.Subtract(this._worldPosition, this._parent?.worldPosition || Vector2.zero)

        this._children.forEach(child => {
            child.worldPosition = Vector2.Add(child.worldPosition, deltaWorldPosition)
        })

        this.observable.Notify("on-change")
        this.observable.Notify("on-position-change")
    }

    public get localPosition(): Readonly<Vector2> {
        return this._localPosition
    }

    public set localPosition(value: Vector2) {
        const deltaWorldPosition = Vector2.Subtract(value, this.worldPosition)
        this._localPosition = value

        /**
         * pw¹ = pl¹ + pw²
         */
        this._worldPosition = Vector2.Add(this._localPosition, this._parent?.worldPosition || Vector2.zero)

        this._children.forEach(child => {
            child.worldPosition = Vector2.Add(child.worldPosition, deltaWorldPosition)
        })

        this.observable.Notify("on-change")
        this.observable.Notify("on-local-position-change")
    }

    public SetParent(parent: Transform) {
        this._parent = parent

        /**
         * pl¹ = pw¹ - pw²
         */
        this._localPosition = Vector2.Subtract(this._worldPosition, parent.worldPosition)
    }

    public UnsetParent() {
        this._parent = undefined

        this._localPosition = this._worldPosition
    }

    public AttachChild(child: Transform): Transform {
        this._children.push(child)

        return child
    }

    public DetachChild(child: Transform): void {
        const index = this._children.indexOf(child)

        if (index === -1) return

        this._children.splice(index, 1)
    }
}
