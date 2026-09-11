console.log("🔥 GENZIFY LOADED");


// ========================================
// GET SETTINGS
// ========================================

function getSettings() {

    return new Promise((resolve) => {

        chrome.storage.local.get(
            ["enabled", "mode", "level"],
            (settings) => {

                resolve({

                    enabled:
                        settings.enabled !== false,

                    mode:
                        settings.mode || "casual",

                    level:
                        settings.level || 2

                });

            }
        );

    });
}


// ========================================
// ASK BACKGROUND TO CONVERT
// ========================================

function genZify(text) {

    return new Promise(async (resolve, reject) => {

        const settings =
            await getSettings();


        if (!settings.enabled) {

            resolve(text);

            return;
        }


        chrome.runtime.sendMessage(
            {
                type: "GENZIFY",

                text: text,

                mode: settings.mode,

                level: settings.level
            },

            (response) => {

                if (
                    chrome.runtime.lastError
                ) {

                    reject(
                        new Error(
                            chrome.runtime
                                .lastError
                                .message
                        )
                    );

                    return;
                }


                if (
                    !response ||
                    !response.success
                ) {

                    reject(
                        new Error(
                            response?.error ||
                            "Unknown error"
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

async function handleEnter(
    element,
    event
) {

    // Only ENTER

    if (
        event.key !== "Enter" ||
        event.shiftKey
    ) {

        return;
    }


    const text =
        element.value;


    if (!text.trim()) {

        return;
    }


    console.log(
        "GenZifying:",
        text
    );


    // STOP the normal search

    event.preventDefault();

    event.stopImmediatePropagation();


    try {

        const converted =
            await genZify(text);


        console.log(
            "GenZ result:",
            converted
        );


        // Put converted text
        // into search box

        element.value =
            converted;


        // Tell the website
        // that the value changed

        element.dispatchEvent(
            new Event(
                "input",
                {
                    bubbles: true
                }
            )
        );


        // Search using
        // converted text

        setTimeout(() => {

            submitSearch(element);

        }, 100);

    }

    catch (error) {

        console.error(
            "GENZIFY ERROR:",
            error
        );


        // If GenZify fails,
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

        }
        else {

            form.submit();

        }

        return;
    }


    // Fallback:
    // press Enter again

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
