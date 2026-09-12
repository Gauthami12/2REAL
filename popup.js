let enabled = true;
let mode = "casual";
let level = 2;


// ==========================
// LOAD SETTINGS
// ==========================

chrome.storage.local.get(
    ["enabled", "mode", "level"],
    (settings) => {

        if (settings.enabled !== undefined) {
            enabled = settings.enabled;
        }

        if (settings.mode !== undefined) {
            mode = settings.mode;
        }

        if (settings.level !== undefined) {
            level = settings.level;
        }

        updateUI();
    }
);


// ==========================
// ON
// ==========================

document.getElementById("onBtn").addEventListener(
    "click",
    () => {

        enabled = true;

        saveSettings();

        updateUI();
    }
);


// ==========================
// OFF
// ==========================

document.getElementById("offBtn").addEventListener(
    "click",
    () => {

        enabled = false;

        saveSettings();

        updateUI();
    }
);

// ==========================
// MODE
// ==========================

document.querySelectorAll(".mode").forEach(
    (button) => {

        button.addEventListener(
            "click",
            () => {

                mode = button.dataset.mode;

                saveSettings();

                updateUI();
            }
        );
    }
);


// ==========================
// LEVEL
// ==========================

document.getElementById("level").addEventListener(
    "input",
    (event) => {

        level = Number(event.target.value);

        saveSettings();

        updateUI();
    }
);


// ==========================
// SAVE
// ==========================

function saveSettings() {

    chrome.storage.local.set({

        enabled: enabled,

        mode: mode,

        level: level

    });
}


// ==========================
// UPDATE UI
// ==========================

function updateUI() {

    document.getElementById("onBtn")
        .classList.toggle(
            "active",
            enabled
        );


    document.getElementById("offBtn")
        .classList.toggle(
            "active",
            !enabled
        );


    document.querySelectorAll(".mode")
        .forEach((button) => {

            button.classList.toggle(
                "active",
                button.dataset.mode === mode
            );

        });


    document.getElementById("level").value = level;


    document.querySelectorAll(".labels span")
        .forEach((label) => {

            label.classList.toggle(
                "active-label",
                Number(label.dataset.level) === level
            );

        });
}
