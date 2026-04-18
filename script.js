
// =====================
// Canvas setup
// =====================
const canvas = document.getElementById("alpacaCanv");
const ctx = canvas.getContext("2d");

canvas.width = 300;
canvas.height = 300;

// =====================
// Layer order (IMPORTANT)
// =====================
const layers = [
  "background",
  "neck",
  "ears",
  "hair",
  "eyes",
  "mouth",
  "leg",
  "accessories"
];

// =====================
// State
// =====================
const state = {
  background: "blue50",
  neck: "default",
  ears: "default",
  hair: "default",
  eyes: "default",
  mouth: "default",
  leg: "default",
  accessories: "none"
};

// =====================
// Options (ALL CATEGORIES)
// =====================
const options = {
  background: ["blue50", "blue60", "green50", "yellow50"],
  neck: ["default", "bend-back"],
  ears: ["default", "tilt-back"],
  hair: ["default", "curls", "short", "bang", "elegant", "quiff"],
  eyes: ["default", "angry", "sleepy"],
  mouth: ["default", "laugh", "tongue"],
  leg: ["default"],
  accessories: ["none", "glasses", "earrings"]
};

// =====================
// Render Alpaca (FIXED SAFE VERSION)
// =====================
function renderAlpaca() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const promises = layers.map(layer => {
    return new Promise(resolve => {
      const img = new Image();
      img.src = `assets/${layer}/${state[layer]}.png`;

      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
    });
  });

  Promise.all(promises).then(images => {
    images.forEach(img => {
      if (img) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }
    });
  });
}

// =====================
// Render style options dynamically
// =====================
let currentCategory = "hair";

function renderStyles() {
  const container = document.querySelector(".style-options");
  container.innerHTML = "";

  options[currentCategory].forEach(style => {
    const div = document.createElement("div");
    div.className = "style-option";
    div.textContent = style;
    div.dataset.style = style;

    div.addEventListener("click", () => {
      document.querySelectorAll(".style-option")
        .forEach(o => o.classList.remove("active"));

      div.classList.add("active");

      state[currentCategory] = style;
      renderAlpaca();
    });

    container.appendChild(div);
  });
}

// =====================
// Category click handler
// =====================
document.querySelectorAll(".category-item").forEach(item => {
  item.addEventListener("click", () => {
    currentCategory = item.dataset.category;

    document.querySelectorAll(".category-item")
      .forEach(i => i.classList.remove("active"));

    item.classList.add("active");

    renderStyles();
  });
});

// =====================
// Randomize button
// =====================
document.getElementById("randomizeButton").addEventListener("click", () => {
  for (let key in options) {
    const arr = options[key];
    state[key] = arr[Math.floor(Math.random() * arr.length)];
  }

  renderAlpaca();
});

// =====================
// Download button
// =====================
document.getElementById("downloadButton").addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "alpaca.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});

// =====================
// INIT
// =====================
renderStyles();
renderAlpaca();