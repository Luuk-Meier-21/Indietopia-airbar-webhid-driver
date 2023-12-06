// A lil hacky but it works.

const setupEvent = new Event("p5-setup");
const drawEvent = new Event("p5-draw");

function setup() {
  const ctx = createCanvas(1400, 900);
  const element = document.getElementById("canvas");

  if (element === null) {
    console.error("Target canvas parent element not found.");
    return;
  }

  ctx.parent(element);

  document.dispatchEvent(setupEvent);
}

function draw() {
  document.dispatchEvent(drawEvent);
}
