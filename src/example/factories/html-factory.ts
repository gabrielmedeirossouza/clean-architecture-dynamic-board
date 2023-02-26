import { Element } from '@/entities'

export class HtmlFactory {
    public createElement(element: Element): HTMLDivElement {
        const newElement = document.createElement('div')
        newElement.classList.add("element")
        newElement.style.left = `${element.transform.worldPosition.x}px`
        newElement.style.bottom = `${element.transform.worldPosition.y}px`
        newElement.textContent = element.name

        return newElement
    }
}
