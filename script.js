// =========================
// ON / OFF
// =========================

const onBtn = document.getElementById("onBtn");
const offBtn = document.getElementById("offBtn");

onBtn.addEventListener("click", () => {

    onBtn.classList.add("active");
    offBtn.classList.remove("active");

});

offBtn.addEventListener("click", () => {

    offBtn.classList.add("active");
    onBtn.classList.remove("active");

});


// =========================
// MODES
// =========================

const modes = document.querySelectorAll(".mode");

modes.forEach(mode => {

    mode.addEventListener("click", () => {

        modes.forEach(button => {
            button.classList.remove("active");
        });

        mode.classList.add("active");

        console.log(
            "Selected mode:",
            mode.dataset.mode
        );

    });

});


// =========================
// SLIDER
// =========================

const level = document.getElementById("level");
const labels = document.querySelectorAll(".labels span");

function updateSlider() {

    // Make all labels black first
    labels.forEach(label => {
        label.classList.remove("active-label");
    });

    // Turn the selected label white
    const selected = level.value - 1;

    labels[selected].classList.add("active-label");
}


// Run when slider moves
level.addEventListener("input", updateSlider);

// Run when extension opens
updateSlider();