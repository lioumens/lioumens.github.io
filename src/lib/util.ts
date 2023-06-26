export function convertClientToSVGCoord(svg, clientX, clientY) {
    const pt = new DOMPoint(clientX, clientY) // gives the same coordinates as pt
    const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
    return svgP
}

export function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
}

export function seq(xmin, xmax, step) {
    const n = Math.floor((xmax - xmin) / step) + 1
    return [...Array(n).keys()].map(i => xmin + i * step)
}
export function seqn(xmin, xmax, n) {
    return [...Array(n).keys()].map(i => xmin + i * (xmax - xmin) / (n - 1))
}

export default convertClientToSVGCoord;
