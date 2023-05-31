
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css'; // optional for styling

window.addEventListener("load", () => {
    const fn_content = document.querySelectorAll('[id^="user-content-fn-"]')
    const fn_ref = document.querySelectorAll('[id^="user-content-fnref-"]');
    // console.log(fn_ref[0].hash)
    if (fn_content.length !== fn_ref.length) {
        console.error("Number of footnotes and footnote references do not match.")
    }

    for (let i = 0; i < fn_content.length; i++) {
        let ref_id = fn_ref[i].id
        // let content_id = fn_content[i].id
        // console.log(fn_ref[i].hash)
        // console.log(fn_content[i].firstElementChild.innerHTML)
        tippy("#" + ref_id, {
            content: fn_content[i].firstElementChild.innerHTML.replace(/<a href="#.*">.*<\/a>/g, ""),
            allowHTML: true,
            interactive : true, // don't disappear when hovering over the footnote
            appendTo: document.body,
            placement: 'right-start',
            theme: 'nord',
            // popperOptions: {
            //     positionFixed: true, // if interactive is cutting off, from FAQ
            // },
        });
    }
})
    