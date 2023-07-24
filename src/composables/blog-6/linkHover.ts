import type {Ref} from "vue"
import {onMounted, watch} from "vue"
import { useEventListener } from "@vueuse/core";

/**
 * @description Serves to combine the hovering and ref states into an "active" state so it can be styled through css. Since this was originally designed for a dragging element, while the element was being dragged, it would mean the mouse was not hovering the element, but I still wanted the element to be styled as if it was hovered. Furthermore, I did not have access to the DOM elements that were created since they are rendered and typeset by Katex, which means that they need to hook into the onMounted lifecycle hook before getting the elements.
 * 
 * @param selector css selector to gather elements to link hover state
 * @param activeRef vue ref also linked to active state
 * @param classToAdd the class name to add when hovering or active
 */
export default function useLinkHover(selector : string, activeRef ?: Ref, classToAdd? : string) {
    let hoverClass = classToAdd || "active"

    let els: NodeListOf<Element>;
    onMounted(() => {
        hoverClass ??= "active"
        els = document.querySelectorAll(selector)
        if (els.length === 0) {
            throw new Error("No element found matching selector " + selector)
        }
        els.forEach(el => {
                useEventListener(el, "mouseenter", () => {
                    els.forEach(linked => linked.classList.add(hoverClass))
                })
                useEventListener(el, "mouseleave", () => {
                    els.forEach(linked => linked.classList.remove(hoverClass))
                })
            })
    })
    if (!!activeRef) {
        watch(activeRef, (newVal) => {
            if (newVal) {
                els.forEach(el => el.classList.add(hoverClass))
            } else {
                els.forEach(el => el.classList.remove(hoverClass))
            }
        })
    }
}