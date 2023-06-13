export function convertClientToSVGCoord(svg, clientX, clientY) {
    const pt = new DOMPoint(clientX, clientY) // gives the same coordinates as pt
    const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
    return svgP
}

export function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
}

export default convertClientToSVGCoord;