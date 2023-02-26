/**
 * Note: example folder just has trash code to demonstrate some visual element manipulation...
 */

import '../style.css'
import { Renderer } from '../example/renderer'
import { Vector2 } from '@/helpers/math'
import { Element, Observer, Transform } from '@/entities'

const root = document.querySelector("#app") as HTMLDivElement
const renderer = new Renderer(root)

const centerX = window.innerWidth / 2
const centerY = window.innerHeight / 2

const a = new Element("A", new Transform(new Vector2(centerX, centerY)))
const b = new Element("B", new Transform(new Vector2(centerX, centerY - 100)))

renderer.AttachElement(a, b)

const displayWorldPositionA = document.querySelector("[data-a-world-position]")!
const displayLocalPositionA = document.querySelector("[data-a-local-position]")!
const displayWorldPositionB = document.querySelector("[data-b-world-position]")!
const displayLocalPositionB = document.querySelector("[data-b-local-position]")!

const A_SPEED = 250 // px/s
const BOUNDARIES = {
    x1: window.innerWidth * 0.25,
    x2: window.innerWidth * 0.75
}

let lastTime = 0
let direction = "left"
let isPaused = false
function anime(time: number) {
    requestAnimationFrame((time) => anime(time / 1000))
    const deltaTime = time - lastTime
    lastTime = time

    if (isPaused) return

    if (direction === "right") {
        a.transform.worldPosition = new Vector2(
            a.transform.worldPosition.x + A_SPEED * deltaTime,
            a.transform.worldPosition.y
        )
    } else {
        a.transform.worldPosition = new Vector2(
            a.transform.worldPosition.x - A_SPEED * deltaTime,
            a.transform.worldPosition.y
        )
    }

    if (a.transform.worldPosition.x <= BOUNDARIES.x1 && direction === "left")
        direction = "right"
    if (a.transform.worldPosition.x >= BOUNDARIES.x2 && direction === "right")
        direction = "left"

    displayWorldPositionA.textContent = a.transform.worldPosition.ToString()
    displayLocalPositionA.textContent = a.transform.localPosition.ToString()
    displayWorldPositionB.textContent = b.transform.worldPosition.ToString()
    displayLocalPositionB.textContent = b.transform.localPosition.ToString()
} anime(0)

window.addEventListener("click", () => {
    if (!a.children.length) {
        a.AttachChild(b)
        return
    }

    a.DetachChild(b)
})

window.addEventListener('keydown', e => {
    if (e.key === " ") {
        isPaused = !isPaused
    }
})
