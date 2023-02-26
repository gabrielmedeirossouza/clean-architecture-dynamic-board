import { Element, TransformObserverMap } from "@/entities"
import { ObserverFactory } from '@/factories'
import { HtmlFactory } from './factories'

const createTransformObserver = new ObserverFactory<TransformObserverMap>().CreateObserver

export class Renderer {
    private _elements: Element[] = []

    constructor(
        private readonly _root: HTMLElement
    ) {}

    public AttachElement(...elements: Element[]): void {
        elements.forEach(element => {
            element.transform.observable.Subscribe(
                createTransformObserver("on-change", this._Update.bind(this))
            )

            this._elements.push(element)
        })

        this._Update()
    }

    public DetachElement(element: Element): void {
        const index = this._elements.indexOf(element)

        if (index === -1) return

        this._elements.splice(index, 1)
    }

    private _Update(): void {
        const htmlFactory = new HtmlFactory()
        this._root.innerHTML = ""

        this._elements.forEach(element => {
            const htmlElement = htmlFactory.createElement(element)
            this._root.appendChild(htmlElement)
        })
    }
}
