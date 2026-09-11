let enabled = true;
let mode = "casual";
let level = 2;


// ON button
document.getElementById("onBtn").addEventListener("click", () => {
    enabled = true;

    document.getElementById("onBtn").classList.add("active");
    document.getElementById("offBtn").classList.remove("active");

    saveSettings();
});


// OFF button
document.getElementById("offBtn").addEventListener("click", () => {
    enabled = false;

    document.getElementById("offBtn").classList.add("active");
    document.getElementById("onBtn").classList.remove("active");

    saveSettings();
});


// Mode buttons
document.querySelectorAll(".mode").forEach(button => {

    button.addEventListener("click", () => {

        document.querySelectorAll(".mode")
            .forEach(btn => btn.classList.remove("active"));

        button.classList.add("active");

        mode = button.dataset.mode;

        saveSettings();
    });

});


// Slider
document.getElementById("level").addEventListener("input", (event) => {

    level = Number(event.target.value);

    saveSettings();

});


// Save settings
function saveSettings() {

    chrome.storage.local.set({
        enabled: enabled,
        mode: mode,
        level: level
    });

}