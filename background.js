console.log("🔥 GENZIFY BACKGROUND LOADED");


chrome.runtime.onMessage.addListener(
    (message, sender, sendResponse) => {

        if (message.type !== "GENZIFY") {
            return;
        }


        // ========================================
        // GET CURRENT SETTINGS
        // ========================================

        chrome.storage.local.get(
            ["enabled", "mode", "level"],
            (settings) => {

                const enabled =
                    settings.enabled !== false;

                const mode =
                    settings.mode || "casual";

                const level =
                    settings.level || 2;


                // ========================================
                // CHECK IF GENZIFY IS OFF
                // ========================================

                if (!enabled) {

                    sendResponse({
                        success: true,
                        result: message.text
                    });

                    return;
                }


                // ========================================
                // SEND TO BACKEND
                // ========================================

                fetch(
                    "http://127.0.0.1:8000/convert",
                    {
                        method: "POST",

                        targetAddressSpace: "loopback",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            text: message.text,

                            mode: mode,

                            level: level

                        })
                    }
                )

                .then(response => {

                    if (!response.ok) {

                        throw new Error(
                            "Backend error: " +
                            response.status
                        );
                    }

                    return response.json();
                })

                .then(data => {

                    console.log(
                        "🔥 GENZIFY RESULT:",
                        data.result
                    );


                    sendResponse({

                        success: true,

                        result: data.result

                    });

                })

                .catch(error => {

                    console.error(
                        "🔥 GENZIFY BACKEND ERROR:",
                        error
                    );


                    sendResponse({

                        success: false,

                        error: error.message

                    });

                });

            }
        );


        // IMPORTANT:
        // We respond asynchronously.

        return true;
    }
);
