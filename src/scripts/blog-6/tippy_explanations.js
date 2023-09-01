import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css'; // optional for styling


window.addEventListener("load", () => {
tippy("#proof--conditional__step1", {
    content: "hello!",
    // allowHTML: true,
    // interactive : true, // don't disappear when hovering over the footnote
    // appendTo: document.body,
    placement: 'top',
    animation: 'shift-away',
    arrow: "small"
    theme: 'nord',
    // popperOptions: {
    //     positionFixed: true, // if interactive is cutting off, from FAQ
    // },
});
})