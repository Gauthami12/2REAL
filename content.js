console.log("🔥 GENZIFY LOADED");


// ========================================
// ASK BACKGROUND TO CONVERT
// ========================================

function genZify(text) {

    return new Promise((resolve, reject) => {

        chrome.runtime.sendMessage(
            {
                type: "GENZIFY",
                text: text
            },

            (response) => {

                if (chrome.runtime.lastError) {

                    reject(
                        new Error(
                            chrome.runtime.lastError.message
                        )
                    );

                    return;
                }

                if (!response || !response.success) {

                    reject(
                        new Error(
                            response?.error ||
                            "Unknown error"
                        )
                    );

                    return;
                }

                resolve(response.result);
            }
        );
    });
}


// ========================================
// HANDLE ENTER
// ========================================

async function handleEnter(element, event) {

    if (
        event.key !== "Enter" ||
        event.shiftKey
    ) {
        return;
    }

    const text = element.value;

    if (!text.trim()) {
        return;
    }

    console.log("GenZifying:", text);

    // Stop normal search
    event.preventDefault();
    event.stopImmediatePropagation();


    try {

        const converted =
            await genZify(text);

        console.log(
            "GenZ result:",
            converted
        );

        // Replace search text
        element.value = converted;

        element.dispatchEvent(
            new Event("input", {
                bubbles: true
            })
        );


        // Search converted text
        setTimeout(() => {

            submitSearch(element);

        }, 100);

    }

    catch (error) {

        console.error(
            "GENZIFY ERROR:",
            error
        );

        // If conversion fails,
        // search original text
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

        } else {

            form.submit();
        }

        return;
    }


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

        if (
            element.tagName === "INPUT" ||
            element.tagName === "TEXTAREA"
        ) {

            handleEnter(
                element,
                event
            );
        }
    },

    true
);
