chrome.runtime.onMessage.addListener(
    (message, sender, sendResponse) => {

        if (message.type !== "GENZIFY") {
            return;
        }

        fetch(
            "http://localhost:8000/convert",
        {
        targetAddressSpace: "loopback",

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            text: message.text,
            mode: message.mode,
            level: message.level
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

            sendResponse({
                success: true,
                result: data.result
            });

        })

        .catch(error => {

            console.error(
                "GENZIFY BACKEND ERROR:",
                error
            );

            sendResponse({
                success: false,
                error: error.message
            });

        });

        return true;
    }
);