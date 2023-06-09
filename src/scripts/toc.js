window.addEventListener("DOMContentLoaded", () => {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          const id = entry.target.children[0].getAttribute("id");
           if (entry.isIntersecting) {  
            document.querySelector(`nav li a[href="#${id}"]`).parentElement.classList.add("active");
           } else {
            document.querySelector(`nav li a[href="#${id}"]`).parentElement.classList.remove("active");
           }
        })
    },{
        rootMargin: '-30% 0% -40% 0%', // narrower interaction box
        root: null // use window viewport
    })

    //TODO: implement nested sections  
    document.querySelectorAll('section').forEach((section) => {
        observer.observe(section)
    })
})

    // 		observer.observe(section);

// window.addEventListener("DOMContentLoaded", () => {
//     console.log("loaded")
//     let currentActive;
//     let currentHeader;
//     let previousHeader;
//     let firstHeader;
//     // let visibleHeaders = []
//     const observer = new IntersectionObserver(entries => {
//         // console.log(entries)
//         // console.log(currentActive)

//         entries.forEach(entry => {
//             const id = entry.target.getAttribute("id");
//             // console.log(id, "is ")
//             // console.log(entry.boundingClientRect.top)
//             if (entry.intersectionRatio > 0) {
//                 console.log(id, "is visible")
//                 if (id !== currentHeader && currentHeader !== undefined) {
//                     console.log("tryingto remove")
//                     document.querySelector(`nav li a[href="#${currentHeader}"]`).parentElement.classList.remove("active");
//                 }
//                 // console.log("new header: ", id, "\n", "current header: ", currentHeader)
//                 if (currentHeader === undefined) {
//                     firstHeader = id;
//                     console.log("FIRST HEADER SET")
//                 }
//                 currentHeader = id;
//                 document.querySelector(`nav li a[href="#${id}"]`).parentElement.classList.add("active");
                    
//                 // visibleHeaders.push(id)
//                 // console.log(visibleHeaders)
//                 // console.log(`"adding to ${id}"`)
//             } else if (entry.boundingClientRect.top < 0) {
//                 console.log(id, "out the top")
//                 if (id !== currentHeader) {
//                     console.log("different, setting previous to id", id);
//                     previousHeader = id
//                 } else {
//                     console.log("same, setting previous to current", id);
//                     previousHeader = currentHeader
//                 }
//                 // update previous heade
//                 // document.querySelector(`nav li a[href="#${id}"]`).parentElement.classList.remove("active");
//             } else if (entry.boundingClientRect.top > 0) {
//                 // need to update to previous UNLESS the first heading. so need state for first heading
//                 console.log(id, "out the bottom")
//                 if (currentHeader !== undefined) {
//                     document.querySelector(`nav li a[href="#${currentHeader}"]`).parentElement.classList.remove("active");
//                 }
//                 if (currentHeader !== firstHeader) {
//                     currentHeader = previousHeader
//                     document.querySelector(`nav li a[href="#${previousHeader}"]`).parentElement.classList.add("active");
//                 }
//             }

//             // if new intersection from bottom,
//             //   go to next entry (when halfway up)
//             //   remove current active
//             // if new intersection from top,
//             //  go to previous entry (when halfway down)
//         })
//     }, {
//         root: null,
//         threshold: 0
//     }
//     )
//     document.querySelectorAll('h2[id]').forEach((section) => {
// 		observer.observe(section);
// 	});
//     // observer.observe(document.querySelector('h2[id="svg-attributes-vs-css-styles"]'))
// })