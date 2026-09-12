console.log("🔥 GENZIFY CONTENT SCRIPT LOADED");


// ========================================
// GENZIFY
// ========================================

function genZify(text) {

    return new Promise((resolve, reject) => {

        chrome.runtime.sendMessage(

            {
                type: "GENZIFY",
                text: text
            },

            (response) => {

                // Chrome/runtime error
                if (chrome.runtime.lastError) {

                    reject(
                        new Error(
                            chrome.runtime.lastError.message
                        )
                    );

                    return;
                }


                // No response
                if (!response) {

                    reject(
                        new Error(
                            "No response from background."
                        )
                    );

                    return;
                }


                // Backend error
                if (!response.success) {

                    reject(
                        new Error(
                            response.error ||
                            "GenZify failed."
                        )
                    );

                    return;
                }


                resolve(
                    response.result
                );
            }
        );
    });
}


// ========================================
// HANDLE ENTER
// ========================================

async function handleEnter(element, event) {

    // Only Enter
    if (event.key !== "Enter") {
        return;
    }


    // Allow Shift + Enter
    if (event.shiftKey) {
        return;
    }


    const text =
        element.value;


    // Empty input
    if (!text.trim()) {
        return;
    }


    console.log(
        "🔥 GenZifying:",
        text
    );


    // Stop Google's normal search
    event.preventDefault();

    event.stopImmediatePropagation();


    try {

        // ========================================
        // ASK BACKGROUND
        // ========================================

        const converted =
            await genZify(text);


        console.log(
            "🔥 GenZ result:",
            converted
        );


        // ========================================
        // PUT RESULT INTO GOOGLE SEARCH
        // ========================================

        element.value =
            converted;


        element.dispatchEvent(
            new Event(
                "input",
                {
                    bubbles: true
                }
            )
        );


        // ========================================
        // SEARCH CONVERTED TEXT
        // ========================================

        setTimeout(
            () => {

                submitSearch(element);

            },
            100
        );

    }


    catch (error) {

        console.error(
            "🔥 GENZIFY ERROR:",
            error
        );


        // If GenZify fails,
        // search original text.

        submitSearch(element);
    }
}


// ========================================
// SUBMIT SEARCH
// ========================================

function submitSearch(element) {

    const form =
        element.closest("form");


    if (form) {

        if (
            typeof form.requestSubmit ===
            "function"
        ) {

            form.requestSubmit();

        }

        else {

            form.submit();

        }

        return;
    }


    // Fallback
    element.dispatchEvent(

        new KeyboardEvent(
            "keydown",
            {
                key: "Enter",
                code: "Enter",
                keyCode: 13,
                which: 13,
                bubbles: true
            }
        )

    );
}


// ========================================
// LISTEN FOR ENTER
// ========================================

document.addEventListener(

    "keydown",

    (event) => {

        const element =
            event.target;


        if (!element) {
            return;
        }


        // Only inputs/textareas
        if (
            element.tagName !== "INPUT" &&
            element.tagName !== "TEXTAREA"
        ) {
            return;
        }


        // Only run on Google
        if (
            !window.location.hostname.includes(
                "google."
            )
        ) {
            return;
        }


        handleEnter(
            element,
            event
        );

    },

    true
);
