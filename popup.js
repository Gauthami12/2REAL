const inputText = document.getElementById("inputText");
const outputText = document.getElementById("outputText");

const style = document.getElementById("style");
const slang = document.getElementById("slang");
const emojis = document.getElementById("emojis");

const convertBtn = document.getElementById("convertBtn");
const copyBtn = document.getElementById("copyBtn");
const status = document.getElementById("status");


convertBtn.addEventListener("click", async () => {

    const text = inputText.value.trim();

    if (!text) {
        status.textContent = "Enter some text first.";
        return;
    }

    status.textContent = "Cooking...";

    try {

        const response = await fetch(
            "http://127.0.0.1:8000/convert",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    text: text,
                    style: style.value,
                    slang: slang.value,
                    emojis: emojis.value
                })
            }
        );

        if (!response.ok) {
            throw new Error("Server error");
        }

        const data = await response.json();

        outputText.value = data.result;

        status.textContent = "Done.";

    } catch (error) {

        console.error(error);

        status.textContent =
            "Could not connect to the Python server.";

    }
});


copyBtn.addEventListener("click", async () => {

    if (!outputText.value) {
        return;
    }

    await navigator.clipboard.writeText(outputText.value);

    status.textContent = "Copied!";
});