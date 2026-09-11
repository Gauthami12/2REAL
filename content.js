console.log("GENZIFY CONTENT SCRIPT LOADED");


document.addEventListener("keydown", (event) => {

    console.log(
        "Key pressed:",
        event.key,
        "Element:",
        event.target
    );

}, true);